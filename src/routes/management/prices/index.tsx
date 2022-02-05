/* eslint-disable no-nested-ternary */
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { DollarSign, Dribbble, Home, Users } from 'react-feather';

import BackButton from '../../../components/backButton';
import FormButton from '../../../components/form/basicButton';
import QuestForm from '../../../components/form/questForm';
import TextHeader from '../../../components/iconTextHeader';
import Item from '../../../components/item';
import Modal from '../../../container/modal';
import { fireArray, fireDocument, getFireCollection } from '../../../data/fire';
import useCompany from '../../../hooks/useCompany';
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
        title="Preise konfigurieren"
        text="Bitte definiere die Preis-Logik und passe die entsprechenden Preise an."
      />
    );
  }

  const serviceProps: { [key: string]: { name: 'Eintritt' | 'Verleihobjekt' | 'Raum/Bahn/Spiel', icon: any } } = {
    entry: { name: 'Eintritt', icon: <Users color="#63e6e1" /> }, object: { name: 'Verleihobjekt', icon: <Dribbble color="#d4be21" /> }, section: { name: 'Raum/Bahn/Spiel', icon: <Home color="#bf5bf3" /> },
  };

  const [type, setType] = useState<'prices' | 'structure' | 'belongs'>('structure');
  const [service, setService] = useState<ServiceInfo | false | undefined>(false);
  const [serviceList, setServiceList] = useState<ServiceInfo[] | false | undefined>(false);
  const [serviceFields, setServiceFields] = useState<ServiceField[] | false | undefined>(false);

  /** Lade alle services von der activity ID */
  const getServiceList = async () => {
    const serviceListData = await getFireCollection(`activities/${data.title.form}/services/`, false, [['serviceName', '!=', false]]);
    if (serviceListData) setServiceList(serviceListData);
  };

  useEffect(() => { getServiceList(); }, []); // load servicelist

  const selectService = (select: ServiceInfo) => {
    setService(select);
    setType(select.structureID ? 'prices' : 'belongs');
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

  const updateServiceList = (structureID: number, serviceID?: string) => {
    if (structureID && serviceID && serviceList) {
      const getIndex: number = serviceList.findIndex((x) => x.id === serviceID);
      const newList = serviceList;
      if (getIndex > -1) {
        const newItem = { ...serviceList[getIndex], structureID };
        newList.splice(getIndex, 1, newItem);
      }
    }
  };

  const closeModal = () => {
    if (type === 'structure' && service && service.structureID) return setType('prices');

    setServiceFields(false);
    setService(false);
  };

  const generateDescription = (newItem: ServiceField): string => {
    const fields = [...(serviceFields ? serviceFields.filter((x) => x.name !== newItem.name) : []), newItem];
    const description: string[] = [];

    const suffixList: { [key: string]: string } = { persons: 'Pers.', time: 'Uhr', age: 'Jahre', discount: 'Rabatt', duration: 'Min.', roundDiscount: 'Runden' };

    fields.forEach((element: ServiceField) => {
      if (!element.notIsChecked) {
        const values = element.answers?.map((ans: AnsDB) => ans.values?.join(' & ')) || [];
        if (values.toString()) description.push(`(${values.toString()} ${suffixList[element.name] || ''})`);
      }
    });

    return description.toString() ? description.join(', ') : 'Nichts definiert';
  };

  const saveQuestions = (newField: ServiceField) => {
    if (service && service.id && service.serviceName) {
      const isInit = !serviceFields;
      const getStructureID = isInit ? +Date.now() : service.structureID;
      fireDocument(`activities/${data.title.form}/structures/${getStructureID}/fields/${newField.name}`, newField, 'set').then(() => {
        const description: string = generateDescription(newField);
        const updatedFields: Structure = { ...(isInit && service.serviceName ? { id: getStructureID, services: [service.serviceName] } : []), description };
        fireDocument(`activities/${data.title.form}/structures/${getStructureID}`, updatedFields, isInit ? 'set' : 'update');
        updateServiceFields(newField);

        if (isInit && updatedFields.id) {
          fireDocument(`activities/${data.title.form}/services/${service.id}`, { structureID: updatedFields.id }, 'update');
          updateServiceList(getStructureID, service.id);
          setService({ ...service, structureID: getStructureID });

          if (service.structureID && service.serviceName) fireArray(`activities/${data.title.form}/structures/${service.structureID}`, 'services', service.serviceName, 'remove');
        }

        if (newField.name === 'discounts') return setType('prices');
      });
    }
  };

  const selectStructure = (fields: ServiceField[] | undefined) => {
    setServiceFields(fields);
    setType('structure');
  };

  const selectPriceStructure = (structureID?: number) => {
    if (structureID === undefined) return selectStructure(undefined);
    if (service && service.id && structureID !== undefined) {
      fireDocument(`activities/${data.title.form}/services/${service.id}`, { structureID }, 'update').then(() => {
        if (service.structureID !== structureID && service.serviceName) {
          fireArray(`activities/${data.title.form}/structures/${structureID}`, 'services', service.serviceName, 'add');
          fireArray(`activities/${data.title.form}/structures/${service.structureID}`, 'services', service.serviceName, 'remove');
        }

        setService({ ...service, structureID }); // update current selection
        updateServiceList(structureID, service.id); // update list
        setType('prices'); // show prices after select
      });
    }
  };

  const navigateToServices = () => route(`/company/services/${activityID}`);

  const changeType = (newType?: 'belongs' | 'prices') => {
    if (newType) return setType(newType);
    return closeModal();
  };

  return (
    <Fragment>
      <TextHeader
        icon={<DollarSign color="#fea00a" />}
        title="Preise konfigurieren"
        text="Bitte definiere die Preis-Logik und passe die entsprechenden Preise an."
      />

      <BackButton url={`/company/dashboard/${activityID}`} />
      <section class="group form small_size_holder">
        {serviceList === false || serviceList?.[0] ? (
          serviceList && serviceList?.map((x: ServiceInfo) => <Item key={x.id} label={`${x.serviceName || ''} ${x.structureID ? '(Preise)' : '(Struktur)'}`} text={x.serviceType && serviceProps[x.serviceType].name} icon={x.serviceType && serviceProps[x.serviceType].icon} action={() => selectService(x)} />)
        ) : (
          <Fragment>
            <p>Es sind noch keine Leistungen angelegt.</p>
            <FormButton label="Leistungen konfigurieren" action={navigateToServices} />
          </Fragment>
        )}
      </section>

      <FormButton action={() => route(`/company/availabilities/${data.title.form}`)} label="Mit den Verfügbarkeiten fortfahren" />

      {service !== false && (
        <Modal title={`(${service?.serviceName})`} close={() => closeModal()} type="large">

          {type === 'belongs' && service?.serviceName && (
            <ChangeStructure activityID={activityID} serviceID={service?.serviceName} select={selectPriceStructure} />
          )}

          {type === 'structure' && serviceFields !== false && (
            <QuestForm
              questions={StructureQuestions}
              service={service}
              serviceFields={serviceFields}
              openings={data.openings}
              save={saveQuestions}
            />
          )}

          {type === 'prices' && service && service.id && service.structureID && (

          <EditPrices structureID={service.structureID} changeType={changeType} serviceID={service.id} editStructure={selectStructure} activityID={activityID} questionLength={StructureQuestions.length} />
          )}
        </Modal>
      )}
    </Fragment>
  );
};

export default Prices;
