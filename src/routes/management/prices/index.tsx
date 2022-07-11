import { IconBrandDribbble, IconCurrencyDollar, IconHome, IconPlus, IconUser } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { route } from 'preact-router';

import BackButton from '../../../components/backButton';
import FormButton from '../../../components/form/basicButton';
import QuestForm from '../../../components/form/questForm';
import TextHeader from '../../../components/infos/iconTextHeader';
import Item from '../../../components/item';
import Spinner from '../../../components/spinner';
import Modal from '../../../container/modal';
import { fireArray, fireDocument, getFireCollection } from '../../../data/fire';
import useCompany from '../../../hooks/useCompany';
import useServiceList from '../../../hooks/useServiceList';
import { Activity } from '../../../interfaces/activity';
import { ServiceField, ServiceInfo } from '../../../interfaces/company';
import EditPrices from './prices';
import StructureQuestions from './structureQuestions';

interface ActivityProp {
    activityID: string;
    activity: Activity;
}

const Prices: FunctionalComponent<ActivityProp> = ({ activity, activityID }: ActivityProp) => {
  const data: Activity | undefined = useCompany(activityID, activity);
  const header = (
    <TextHeader
      icon={<IconCurrencyDollar color="#fea00a" />}
      title="Preise"
      text="Im folgenden stellen wir ihnen 6 Fragen, anhand der wir ihre individuelle Tabelle zur Preisangabe generieren."
    />
  );
  if (!data) return header;

  const serviceProps: { [key: string]: { name: 'Eintritt' | 'Verleihobjekt' | 'Raum/Bahn/Spiel', icon: any } } = {
    entry: { name: 'Eintritt', icon: <IconUser color="#63e6e1" /> }, object: { name: 'Verleihobjekt', icon: <IconBrandDribbble color="#d4be21" /> }, section: { name: 'Raum/Bahn/Spiel', icon: <IconHome color="#bf5bf3" /> },
  };

  const [show, setShow] = useState<'prices' | 'structure' | 'belongs' | false>(false);
  const [selected, setSelected] = useState<{ service: ServiceInfo, structure?: ServiceField[] } | false>(false);

  const { serviceList } = useServiceList(activityID);

  const selectService = async (service: ServiceInfo) => {
    const structure: ServiceField[] | undefined = await getFireCollection(`activities/${activityID}/services/${service.id}/structure`, false);

    setShow(structure && structure.length === StructureQuestions.length ? 'belongs' : 'structure');
    setSelected({ service, structure });
  };

  const updateStructureField = (newField: ServiceField) => {
    if (selected === false) return;
    if (!selected.structure) return setSelected({ ...selected, structure: [newField] });

    const getSpecs: any = selected.structure.findIndex((s) => s.name === newField.name);
    if (getSpecs?.currentIndex && getSpecs.currentIndex !== -1) {
      const newList = selected.structure;
      newList.splice(getSpecs.currentIndex, 1, newField);
      return setSelected({ ...selected, structure: [...newList] });
    }
    return setSelected({ ...selected, structure: [...selected.structure, newField] });
  };

  const closeModal = () => {
    if (show === 'structure' && selected && selected.structure) return setShow('prices');
    setSelected(false);
  };

  const generateDescription = (newField: ServiceField): any => {
    const fields: ServiceField[] = (selected && selected.structure?.filter((x) => x.name !== newField.name)) || [];
    fields.push(newField);

    const description: string[] = [];
    // const newSpecs: any = {};
    const suffixList: { [key: string]: string } = { persons: 'Pers.', time: 'Uhr', age: 'Jahre', discount: 'Rabatt', duration: 'Min.', roundDiscount: 'Runden' };
    // const specFieldIds = ['persons', 'days'];

    fields?.forEach((element: ServiceField) => {
      if ((!!element.selected || element.name === 'days') && element.name) {
        const values = element.selected?.values?.map((x) => (x.value ? x.value : '')).join(' & ');
        if (values) description.push(`(${values} ${suffixList[element.name] || ''})`);

        // if (specFieldIds.includes(element.name)) {
        //   if (element.name !== 'days') newSpecs[element.name] = element.selected?.name;
        //   if (element.name === 'days') newSpecs.days = !element.selected ? [] : element.selected?.values;
        // }
      }
    });

    return description.toString() ? description.join(', ') : 'Nichts definiert';
  };

  const updateStructure = (newField: ServiceField, isInit: boolean) => {
    if (!selected) return;
    const description: string = generateDescription(newField);

    if (isInit) fireArray(`activities/${activityID}`, 'state', 'prices', 'add');
    return fireDocument(`activities/${data.title.form}/services/${selected.service.id}`, { description }, 'update');
  };

  const saveQuestions = (newField: ServiceField) => {
    if (selected) {
      const isInit = !selected.structure;

      fireDocument(`activities/${data.title.form}/services/${selected.service.id}/structure/${newField.name}`, newField, 'set').then(() => {
        updateStructure(newField, isInit);
        updateStructureField(newField);

        if (newField.name === 'discounts') return setShow('prices');
      });
    }
  };

  const selectStructure = (fields: ServiceField[] | undefined, showType: 'structure' | 'belongs') => {
    setShow(showType);
    // setServiceFields(fields);
  };

  const navigateToServices = () => route(`/company/services/${activityID}`);

  return (
    <Fragment>
      {header}

      <BackButton url={`/company/dashboard/${activityID}`} />

      {serviceList !== false ? (
        <section class="group form small_size_holder">
          {serviceList ? (
            serviceList.map((x: ServiceInfo) => x.serviceName && <Item key={x.id} label={`${x.serviceName || ''} ${x.structureID ? '' : '(Tabelle)'}`} text={x.serviceType && serviceProps[x.serviceType].name} icon={x.serviceType && serviceProps[x.serviceType].icon} action={() => selectService(x)} />)
          ) : (
            <Item icon={<IconPlus />} type="grey" label="Jetzt eine Leistung anlegen" text="Sie haben noch keine Leistungen definiert; Jetzt eine neue Leistung anlegen" action={navigateToServices} />
          )}
        </section>
      ) : <Spinner />}

      <FormButton action={() => route(`/company/availabilities/${data.title.form}`)} label="Mit den Verfügbarkeiten fortfahren" />

      {selected && (
        <Modal title={`(${selected.service.serviceName})`} close={() => closeModal()} type="large" invert={show === 'structure' ? true : undefined}>

          {show === 'structure' && selected && (
            <QuestForm
              questions={StructureQuestions}
              service={selected.service}
              serviceFields={selected.structure}
              openingDays={['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].filter((x, index) => !!data.openings[index])}
              // structure={selected.structure}
              save={saveQuestions}
            />
          )}

          {show !== 'structure' && selected && selected.service.id && (
            <EditPrices structure={selected.structure} serviceID={selected.service.id} editStructure={selectStructure} activityID={activityID} questionLength={StructureQuestions.length} openingDays={['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].filter((x, index) => !!data.openings[index])} />
          )}
        </Modal>
      )}
    </Fragment>
  );
};

export default Prices;
