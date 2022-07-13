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
import ChangeStructure from './changeStructure';
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

  const [show, setShow] = useState<'prices' | 'structure' | 'change' | false | undefined>(false);
  const [selected, setSelected] = useState<{ service: ServiceInfo, structure?: ServiceField[], dayGroups?: string[], day?: string } | false>(false);

  const { serviceList } = useServiceList(activityID);

  const generateDayGroups = (structure?: ServiceField[]): string[] | undefined => {
    if (!structure) return;
    const allGroups: string[][] = []; // Hier sind alle Gruppen die existieren drinne
    const unUsedDays: string[] = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].filter((x, index) => !!data.openings[index]); // Unbenutzte Tage (Anhand der Öffnungszeiten)
    const einzelneTage: string[] = []; // Hier werden bereits einzelne Tage gespeichert

    structure.forEach((x: ServiceField) => {
      x.selected?.values?.forEach((element) => {
        if (element.onDays && !allGroups.some((v) => v.toString() === element.onDays?.toString())) { // hier werden noch doppelte gruppen hinzugefügt
          allGroups.push(element.onDays);
          if (element.onDays.length === 1) {
            einzelneTage.push(element.onDays[0]);
            unUsedDays.splice(unUsedDays.indexOf(element.onDays[0]), 1);
          }
        }
      });
    });

    const uniqeGroups: string[][] = []; // Hier werden die finalen Gruppen gespeichert
    ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].forEach((day: string) => {
      if (unUsedDays.includes(day)) {
        const alleAngelegten: string[][] = [];
        const alleMitTag: string[] = [];

        allGroups.forEach((x) => {
          if (x.includes(day)) {
            alleAngelegten.push(x);
            x.forEach((y) => {
              if (!alleMitTag.includes(y) && unUsedDays.includes(y)) alleMitTag.push(y);
            });
          }
        });

        const splitted: string[] = [];
        alleMitTag.forEach((x: string) => {
          if (unUsedDays.includes(x)) {
            const isInAllGroups = alleAngelegten.every((g) => g.includes(x));
            const otherIsInOther = allGroups.some((l) => l.includes(x) && alleAngelegten.findIndex((f) => f.toString() === l.toString()) === -1);
            if (isInAllGroups && !otherIsInOther) {
              splitted.push(x);
              unUsedDays.splice(unUsedDays.indexOf(x), 1);
            }
          }
        });

        if (splitted[0]) uniqeGroups.push(splitted);
      }
    });

    if (unUsedDays[0]) uniqeGroups.push(unUsedDays);

    const newGroups: string[] = uniqeGroups.map((x) => x.join(', '));

    return [...newGroups, ...einzelneTage];
  };

  const selectService = async (service: ServiceInfo) => {
    setShow(undefined);
    const structure: ServiceField[] | undefined = await getFireCollection(`activities/${activityID}/services/${service.id}/structure`, false);
    const isComplete = structure && structure.length === StructureQuestions.length;

    const dayGroups: string[] | undefined = isComplete ? generateDayGroups(structure) : undefined;

    setShow(isComplete ? 'change' : 'structure');
    setSelected({ service, structure, dayGroups });
  };

  const updateStructureField = (newField: ServiceField) => {
    if (selected === false) return;
    const newStructure: ServiceField[] = selected.structure || [];

    if (!selected.structure) {
      newStructure.push(newField);
    } else {
      const currentIndex: number = newStructure.findIndex((s) => s.name === newField.name);
      if (currentIndex !== -1) {
        newStructure.splice(currentIndex, 1, newField);
      } else {
        newStructure.push(newField);
      }
    }

    const dayGroups: string[] | undefined = newStructure.length === StructureQuestions.length ? generateDayGroups(newStructure) : undefined;
    setSelected({ ...selected, structure: newStructure, dayGroups });
  };

  const closeModal = () => {
    if (show === 'structure') return setShow('change');
    setShow(false);
    setSelected(false);
  };

  const generateDescription = (newField: ServiceField): any => {
    const fields: ServiceField[] = (selected && selected.structure?.filter((x) => x.name !== newField.name)) || [];
    fields.push(newField);

    const description: string[] = [];
    const suffixList: { [key: string]: string } = { persons: 'Pers.', time: 'Uhr', age: 'Jahre', discount: 'Rabatt', duration: 'Min.', roundDiscount: 'Runden' };

    fields?.forEach((element: ServiceField) => {
      if ((!!element.selected || element.name === 'days') && element.name) {
        const values = element.selected?.values?.map((x) => (x.value ? x.value : '')).join(' & ');
        if (values) description.push(`(${values} ${suffixList[element.name] || ''})`);
      }
    });

    return description.toString() ? description.join(', ') : 'Nichts definiert';
  };

  const changeDay = (dayName: string | undefined) => {
    if (selected && dayName) return setSelected({ ...selected, day: dayName });
    return setShow('change');
  };

  const saveStructure = (newField: ServiceField, isInit: boolean) => {
    if (!selected) return;
    const description: string = generateDescription(newField);

    if (isInit) fireArray(`activities/${activityID}`, 'state', 'prices', 'add');
    return fireDocument(`activities/${data.title.form}/services/${selected.service.id}`, { description }, 'update');
  };

  const saveQuestions = (newField: ServiceField) => {
    if (selected) {
      const isInit = !selected.structure;

      fireDocument(`activities/${data.title.form}/services/${selected.service.id}/structure/${newField.name}`, newField, 'set').then(() => {
        saveStructure(newField, isInit);
        updateStructureField(newField);

        if (newField.name === 'discounts') return setShow('change');
      });
    }
  };

  const selectStructure = (showType: 'structure' | 'prices', day?: string) => {
    if (showType === 'structure' || !selected) return setShow('structure');

    setShow(showType);
    setSelected({ ...selected, day });
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

      {show !== false && (
        <Modal title={(selected && selected.service?.serviceName) || ''} close={() => closeModal()} type="large" invert={show === 'structure' || undefined}>

          {!show && <Spinner />}

          {show === 'change' && selected && (
            <ChangeStructure
              unfinishedNr={StructureQuestions.length - (selected.structure?.length || 0)}
              dayGroups={selected.dayGroups}
              openModal={selectStructure}
            />
          )}

          {show === 'structure' && selected && (
            <QuestForm
              questions={StructureQuestions}
              service={selected.service}
              serviceFields={selected.structure}
              openingDays={['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].filter((x, index) => !!data.openings[index])}
              save={saveQuestions}
            />
          )}

          {show === 'prices' && selected && selected.service.id && selected.day && (
            <EditPrices structure={selected.structure} serviceID={selected.service.id} day={selected.day} activityID={activityID} dayGroups={selected.dayGroups} changeDay={changeDay} />
          )}
        </Modal>
      )}
    </Fragment>
  );
};

export default Prices;
