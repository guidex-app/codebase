/* eslint-disable no-nested-ternary */
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { ArrowLeftCircle, DollarSign, Dribbble, Home, Users } from 'react-feather';

import BackButton from '../../../components/backButton';
import FormButton from '../../../components/form/basicButton';
import QuestForm from '../../../components/form/questForm';
import TextHeader from '../../../components/iconTextHeader';
import Item from '../../../components/item';
import Modal from '../../../container/modal';
import { fireArray, fireDocument, getFireCollection } from '../../../data/fire';
import useCompany from '../../../hooks/useCompany';
import useServiceList from '../../../hooks/useServiceList';
import { Activity } from '../../../interfaces/activity';
import { AnsDB, ServiceField, ServiceInfo, Structure } from '../../../interfaces/company';
import ChangeStructure from './changeStructure';
import EditPrices from './prices';
import StructureQuestions from './structureQuestions';

interface ActivityProp {
    activityID: string;
    activity: Activity;
    uid: string;
}

const Prices: FunctionalComponent<ActivityProp> = ({ activity, activityID, uid }: ActivityProp) => {
  const data = useCompany(activityID, activity);
  if (!data || !uid) {
    return (
      <TextHeader
        icon={<DollarSign color="#fea00a" />}
        title="Preis-Tabellen"
        text="Bitte definiere die Preis-Logik und passe die entsprechenden Preise an."
      />
    );
  }

  const serviceProps: { [key: string]: { name: 'Eintritt' | 'Verleihobjekt' | 'Raum/Bahn/Spiel', icon: any } } = {
    entry: { name: 'Eintritt', icon: <Users color="#63e6e1" /> }, object: { name: 'Verleihobjekt', icon: <Dribbble color="#d4be21" /> }, section: { name: 'Raum/Bahn/Spiel', icon: <Home color="#bf5bf3" /> },
  };

  const [show, setShow] = useState<'prices' | 'structure' | 'belongs'>('structure');
  const [selected, setSelected] = useState<{ service?: ServiceInfo, structure?: Structure } | undefined>();

  const { serviceList, updateServiceList } = useServiceList(activityID);
  const [structureList, setStructureList] = useState<Structure[]>([]);
  const [serviceFields, setServiceFields] = useState<ServiceField[] | false | undefined>(false);

  /** Lade alle services von der activity ID */
  const getServiceStructures = async () => {
    const serviceFieldData = await getFireCollection(`activities/${activityID}/structures`, false);
    setStructureList(serviceFieldData);
  };

  useEffect(() => { getServiceStructures(); }, []); // load servicelist

  const selectService = (service: ServiceInfo) => {
    const structure: Structure | undefined = structureList.find((s) => s.id === service.structureID);
    setSelected({ service, structure });
    setShow(service && structure ? 'prices' : 'belongs');
  };

  const updateServiceFields = (newField: ServiceField) => {
    if (!serviceFields) return setServiceFields([newField]);
    const getSpecs: any = serviceFields.findIndex((s) => s.name === newField.name);
    if (getSpecs?.currentIndex && getSpecs.currentIndex !== -1) {
      const newList = serviceFields;
      newList.splice(getSpecs.currentIndex, 1, newField);
      return setServiceFields([...newList]);
    }
    return setServiceFields([...serviceFields, newField]);
  };

  const closeModal = () => {
    if (show === 'structure' && selected && selected.structure) return setShow('prices');

    setServiceFields(false);
    setSelected(undefined);
  };

  const getSpecs = (newField: ServiceField): any => {
    const fields: ServiceField[] = (serviceFields && serviceFields?.filter((x) => x.name !== newField.name)) || [];
    fields.push(newField);

    const description: string[] = [];
    const newSpecs: any = {};
    const suffixList: { [key: string]: string } = { persons: 'Pers.', time: 'Uhr', age: 'Jahre', discount: 'Rabatt', duration: 'Min.', roundDiscount: 'Runden' };
    const specFieldIds = ['foundation', 'persons', 'duration', 'days'];

    fields?.forEach((element: ServiceField) => {
      if ((!element.notIsChecked || element.name === 'days') && element.name) {
        const values = element.answers?.map((ans: AnsDB) => ans.values?.join(' & ')) || [];
        if (values.toString()) description.push(`(${values.toString()} ${suffixList[element.name] || ''})`);

        if (specFieldIds.includes(element.name)) {
          if (element.name !== 'days') newSpecs[element.name] = element.answers?.[0].name;
          if (element.name === 'days') newSpecs.days = element.notIsChecked ? [] : element.answers?.[0].values;
        }
      }
    });

    return {
      description: description.toString() ? description.join(', ') : 'Nichts definiert',
      ...newSpecs,
    };
  };

  const updateStructure = (newField: ServiceField, structureID: number, isInit: boolean) => {
    const specs: any = getSpecs(newField);

    if (isInit) {
      setSelected({ ...selected, structure: { id: structureID } });
      const initialField = { id: structureID, services: [selected?.service?.serviceName], description: specs.description };
      fireArray(`activities/${activityID}`, 'state', 'prices', 'add');
      return fireDocument(`activities/${data.title.form}/structures/${structureID}`, initialField, 'set');
    }

    setSelected({ ...selected, structure: { id: structureID, ...specs } });
    fireDocument(`activities/${data.title.form}/structures/${structureID}`, specs, 'update');
  };

  const saveQuestions = (newField: ServiceField) => {
    if (selected && selected.service?.id && selected.service?.serviceName) {
      const isInit = !serviceFields;
      const getStructureID: number = isInit ? +Date.now() : selected.structure?.id || selected.service.structureID;
      fireDocument(`activities/${data.title.form}/structures/${getStructureID}/fields/${newField.name}`, newField, 'set').then(() => {
        updateStructure(newField, getStructureID, isInit);
        updateServiceFields(newField);

        if (isInit) {
          fireDocument(`activities/${data.title.form}/services/${selected.service?.id}`, { structureID: getStructureID }, 'update');
          if (selected.service?.structureID && selected.service?.serviceName) fireArray(`activities/${data.title.form}/structures/${selected.service?.structureID}`, 'services', selected.service?.serviceName, 'remove');
        }

        if (newField.name === 'discounts') return setShow('prices');
      });
    }
  };

  const selectStructure = (fields: ServiceField[] | undefined, showType: 'structure' | 'belongs') => {
    setShow(showType);
    setServiceFields(fields);
  };

  const selectPriceStructure = (structureID?: number) => {
    if (structureID === undefined) return selectStructure(undefined, 'structure'); // neu anlegen
    if (selected && selected.service?.id && structureID !== undefined) {
      fireDocument(`activities/${data.title.form}/services/${selected.service.id}`, { structureID }, 'update').then(() => {
        if (selected.service?.structureID !== structureID && selected.service?.serviceName) {
          fireArray(`activities/${data.title.form}/structures/${structureID}`, 'services', selected.service.serviceName, 'add');
          fireArray(`activities/${data.title.form}/structures/${selected.service.structureID}`, 'services', selected.service.serviceName, 'remove');
        }

        const findStructure = structureList.find((x) => x.id === structureID);
        setSelected({ ...selected, structure: findStructure }); // update current selection

        updateServiceList({ ...selected.service, structureID });
        setShow('prices'); // show prices after select
      });
    }
  };

  const navigateToServices = () => route(`/company/services/${activityID}`);

  const changeType = (newType?: 'belongs' | 'prices' | undefined) => {
    if (!newType) return closeModal();
    return setShow(newType);
  };

  return (
    <Fragment>
      <TextHeader
        icon={<DollarSign color="#fea00a" />}
        title="Preis-Tabellen"
        text="Bitte definiere die Preis-Logik und passe die entsprechenden Preise an."
      />

      <BackButton url={`/company/dashboard/${activityID}`} />
      <section class="group form small_size_holder">
        {serviceList === undefined || serviceList?.[0] ? (
          serviceList && serviceList?.map((x: ServiceInfo) => x.serviceName && <Item key={x.id} label={`${x.serviceName || ''} ${x.structureID ? '' : '(Tabelle)'}`} text={x.serviceType && serviceProps[x.serviceType].name} icon={x.serviceType && serviceProps[x.serviceType].icon} action={() => selectService(x)} />)
        ) : (
          <Item icon={<ArrowLeftCircle />} type="grey" label="Jetzt eine Leistung anlegen" text="Sie haben noch keine Leistungen definiert; Jetzt eine neue Leistung anlegen" action={navigateToServices} />
        )}
      </section>

      <FormButton action={() => route(`/company/availabilities/${data.title.form}`)} label="Mit den Verfügbarkeiten fortfahren" />

      {selected && (
        <Modal title={`(${selected?.service?.serviceName})`} close={() => closeModal()} type="large">

          {show === 'belongs' && selected?.service?.serviceName && <ChangeStructure select={selectPriceStructure} />}

          {show === 'structure' && serviceFields !== false && (
            <QuestForm
              questions={StructureQuestions}
              service={selected?.service}
              serviceFields={serviceFields}
              openings={data.openings}
              structure={selected.structure}
              save={saveQuestions}
            />
          )}

          {show === 'prices' && selected && selected.service?.id && selected.structure && (
            <EditPrices structure={selected.structure} changeType={changeType} serviceID={selected.service.id} editStructure={selectStructure} activityID={activityID} questionLength={StructureQuestions.length} />
          )}
        </Modal>
      )}
    </Fragment>
  );
};

export default Prices;
