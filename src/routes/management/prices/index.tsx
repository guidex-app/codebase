/* eslint-disable no-nested-ternary */
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { DollarSign, Dribbble, Home, Users } from 'react-feather';
import { route } from 'preact-router';
import BackButton from '../../../components/backButton';
import QuestForm from '../../../components/form/questForm';

import TextHeader from '../../../components/iconTextHeader';
import Modal from '../../../container/modal';
import { fireDocument, getFireCollection } from '../../../data/fire';

import useCompany from '../../../hooks/useCompany';
import { Activity } from '../../../interfaces/activity';
import { AnsDB, ServiceField, ServiceInfo, Structure } from '../../../interfaces/company';
import StructureQuestions from './structureQuestions';
import EditPrices from './editPrices';
import Item from '../../../components/item';
import TopButton from '../../../components/topButton';
import ChangeStructure from './changeStructure';
import FormButton from '../../../components/form/basicButton';

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
        text="Definiere die Preislogiken anhand der angelegten Leistungsgruppen."
      />
    );
  }

  const serviceProps: { [key: string]: { name: 'Eintritt' | 'Verleihobjekt' | 'Raum/Bereich', icon: any } } = {
    entry: { name: 'Eintritt', icon: <Users color="#63e6e1" /> }, object: { name: 'Verleihobjekt', icon: <Dribbble color="#d4be21" /> }, roundGames: { name: 'Raum/Bereich', icon: <Home color="#bf5bf3" /> },
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

  useEffect(() => {
    getServiceList();
  }, []); // load servicelist

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

  const closeService = () => {
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
      console.log(getStructureID);
      fireDocument(`activities/${data.title.form}/structures/${getStructureID}/fields/${newField.name}`, newField, 'set').then(() => {
        const description: string = generateDescription(newField);
        const updatedFields: Structure = { ...(isInit && service.serviceName ? { id: getStructureID, services: [service.serviceName] } : []), description };
        fireDocument(`activities/${data.title.form}/structures/${getStructureID}`, updatedFields, isInit ? 'set' : 'update');
        updateServiceFields(newField);

        if (isInit && updatedFields.id) {
          fireDocument(`activities/${data.title.form}/services/${service.id}`, { structureID: updatedFields.id }, 'update');
          updateServiceList(getStructureID, service.id);
          setService({ ...service, structureID: getStructureID });
        }

        if (newField.name === 'discounts') return setType('prices');
      });
    }
  };

  const createNewStructure = () => {
    setType('structure');
    setServiceFields(undefined);
  };

  const selectPriceStructure = (structureID?: number) => {
    if (structureID === undefined) return createNewStructure();
    if (service && service.id && structureID !== undefined) {
      fireDocument(`activities/${data.title.form}/services/${service.id}`, { structureID }, 'update').then(() => {
        if (structureID) {
          setService({ ...service, structureID });
          updateServiceList(structureID, service.id);
          setType('prices');
        }
      });
    }
  };

  const navigateToServices = () => route(`/company/services/${activityID}`);

  return (
    <Fragment>
      <TextHeader
        icon={<DollarSign color="#fea00a" />}
        title="Preise konfigurieren"
        text="Definiere die Preislogiken anhand der angelegten Leistungsgruppen."
      />
      <main class="small_size_holder">
        <BackButton url={`/company/dashboard/${activityID}`} />
        <section class="group form">
          {serviceList === false || serviceList?.[0] ? (
            serviceList && serviceList?.map((x: ServiceInfo) => <Item key={x.id} label={`${x.serviceName || ''} ${x.structureID ? '(Preise)' : '(Struktur)'}`} text={x.serviceType && serviceProps[x.serviceType].name} icon={x.serviceType && serviceProps[x.serviceType].icon} action={() => selectService(x)} />)
          ) : (
            <Fragment>
              <p>Es sind noch keine Leistungen angelegt.</p>
              <FormButton label="Leistungen konfigurieren" action={navigateToServices} />
            </Fragment>
          )}
        </section>
      </main>

      {service !== false && (
        <Modal title="" close={() => closeService()} type="large">
          {type === 'belongs' && service?.serviceName && (
            <Fragment>
              {service?.structureID && <TopButton title="Preise" action={() => setType('prices')} />}
              <ChangeStructure activityID={activityID} serviceID={service?.serviceName} select={selectPriceStructure} />
            </Fragment>
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
            <Fragment>
              <TopButton title="Preis-Struktur" action={() => setType('belongs')} />
              <EditPrices structureID={service.structureID} serviceID={service.id} activityID={activityID} />
            </Fragment>
          )}
        </Modal>
      )}
    </Fragment>
  );
};

export default Prices;
