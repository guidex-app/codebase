/* eslint-disable no-nested-ternary */
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Link } from 'preact-router';
import { Box, Circle, DollarSign, Home } from 'react-feather';
import BackButton from '../../../components/backButton';
import QuestForm from '../../../components/form/questForm';

import Item from '../../../components/item';
import TextHeader from '../../../components/iconTextHeader';
import Modal from '../../../container/modal';
import { fireDocument, getFireCollection } from '../../../data/fire';

import useCompany from '../../../hooks/useCompany';
import { Activity } from '../../../interfaces/activity';
import { ServiceField, ServiceInfo } from '../../../interfaces/company';
import StructureQuestions from './structureQuestions';
import { getPerfectNumber } from '../../../helper/number';

interface ActivityProp {
    activityID: string;
    activity: Activity;
    uid: string;
}

const Structure: FunctionalComponent<ActivityProp> = ({ activity, activityID, uid }: ActivityProp) => {
  const data = useCompany(activityID, activity);
  if (!data || !uid) {
    return (
      <TextHeader
        icon={<DollarSign color="#fea00a" />}
        title="Rabatte konfigurieren"
        text="Definiere die Preislogiken anhand der angelegten Leistungsgruppen."
      />
    );
  }

  const serviceProps: { [key: string]: { name: 'Eintritt' | 'Verleihobjekt' | 'Raum/Bereich', icon: any } } = {
    entry: { name: 'Eintritt', icon: <Home /> }, object: { name: 'Verleihobjekt', icon: <Box /> }, roundGames: { name: 'Raum/Bereich', icon: <Circle /> },
  };

  const [service, setService] = useState<ServiceInfo | false | undefined>(false);
  const [serviceList, setServiceList] = useState<ServiceInfo[]>([]);

  const [serviceFields, setServiceFields] = useState<ServiceField[] | false | undefined>(false);

  /** Lade alle services von der activity ID */
  const getServiceList = async () => {
    const serviceListData = await getFireCollection(`activities/${data.title.form}/services/`, false, [['serviceNames', '!=', false]]);
    if (serviceListData) setServiceList(serviceListData);
  };

  /** Lade alle services von der activity ID */
  const getServiceFields = async (select: ServiceInfo) => {
    const serviceFieldData = await getFireCollection(`activities/${data.title.form}/services/${select.id}/structure`, false);
    setServiceFields(serviceFieldData[0] ? serviceFieldData : undefined);
  };

  useEffect(() => { getServiceList(); }, []); // load servicelist

  const selectService = (select: ServiceInfo) => {
    setService(select);
    getServiceFields(select); // load servicefields
  };

  const updateServiceFields = (newField: ServiceField) => {
    if (serviceFields) {
      const getIndex: number = (serviceFields && serviceFields.findIndex((x: ServiceField) => x.name === newField.name)) || -1;
      if (getIndex !== -1) {
        const newList = serviceFields;
        newList.splice(getIndex, 1, newField);
        return setServiceFields([...newList]);
      }
      return setServiceFields([...serviceFields, newField]);
    }

    return setServiceFields([newField]);
  };

  const updateServiceList = (structure: string[], id?: string) => {
    if (id) {
      const getIndex: number = serviceList.findIndex((x) => x.id === id);
      const newList = serviceList;
      if (getIndex > -1) {
        const newItem = { ...serviceList[getIndex], structure };
        newList.splice(getIndex, 1, newItem);
      }
    }
  };

  const closeService = () => {
    setServiceFields(false);
    setService(false);
  };

  const saveQuestions = (newField: ServiceField) => {
    if (service && service.id) {
      fireDocument(`activities/${data.title.form}/services/${service.id}/structure/${newField.name}`, newField, 'set').then(() => {
        if (!(service.structure?.includes(newField.name))) {
          const structure = [...(service && service.structure ? service.structure : []), newField.name];
          fireDocument(`activities/${data.title.form}/services/${service.id}`, { structure }, 'update');
          updateServiceList(structure, service.id);
          setService({ ...(service || []), structure });
        }
        if (newField.name === 'discounts') return closeService();

        updateServiceFields(newField);
      });
    }
  };

  const generateServiceLabel = (x: ServiceInfo): string => {
    const percent: number = ((x?.structure?.length || 0) / (StructureQuestions.length)) * 100;
    return `${x.serviceNames?.toString() || ''} (${getPerfectNumber(percent)}%)`;
  };

  return (
    <Fragment>
      <TextHeader
        icon={<DollarSign color="#fea00a" />}
        title="Rabatte konfigurieren"
        text="Definiere die Preislogiken anhand der angelegten Leistungsgruppen."
      />
      <main class="small_size_holder">
        <BackButton url={`/company/dashboard/${activityID}`} />

        <section class="group form">
          <h3>Wähle eine Leistungsgruppe</h3>
          {serviceList?.map((x: ServiceInfo) => <Item key={x.id} label={generateServiceLabel(x)} icon={x.serviceType && serviceProps[x.serviceType].icon} action={() => selectService(x)} />)}
          <p class="grey">Wenn Sie eine weitere Preis-Logik benötigen, legen sie diese als eine <Link href={`/company/services/${activityID}`} class="red">neue Leistungsgruppe</Link> an.<br /></p>
        </section>
      </main>
      {service !== false && serviceFields !== false && (
      <Modal title="" close={() => closeService()} type="large">
        <QuestForm
          questions={StructureQuestions}
          service={service}
          serviceFields={serviceFields}
          openings={data.openings}
          save={saveQuestions}
        />
      </Modal>
      )}
    </Fragment>
  );
};

export default Structure;
