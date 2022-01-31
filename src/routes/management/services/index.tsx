/* eslint-disable no-nested-ternary */
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Archive, Dribbble, Home, PlusCircle, Users } from 'react-feather';
import BackButton from '../../../components/backButton';
import QuestForm from '../../../components/form/questForm';

import Item from '../../../components/item';
import TextHeader from '../../../components/iconTextHeader';
import Modal from '../../../container/modal';
import { fireDocument, getFireCollection } from '../../../data/fire';
import useCompany from '../../../hooks/useCompany';
import { Activity } from '../../../interfaces/activity';
import { AnsDB, ServiceField, ServiceInfo } from '../../../interfaces/company';
import ServiceQuestions from './serviceQuestions';

interface ActivityProp {
    activityID: string;
    activity: Activity;
    uid: string;
}

const Services: FunctionalComponent<ActivityProp> = ({ activity, activityID, uid }: ActivityProp) => {
  const data = useCompany(activityID, activity);
  if (!data || !uid) return <TextHeader icon={<Archive color="#0983fe" />} title="Leistungen konfigurieren" text="Definiere alle Angebote die du zur verfügung stellen willst" />;

  const serviceProps: { [key: string]: { name: 'Eintritt' | 'Verleihobjekt' | 'Raum/Bahn/Spiel', icon: any } } = {
    entry: { name: 'Eintritt', icon: <Users color="#63e6e1" /> }, object: { name: 'Verleihobjekt', icon: <Dribbble color="#d4be21" /> }, section: { name: 'Raum/Bahn/Spiel', icon: <Home color="#bf5bf3" /> },
  };

  const fields = ['serviceName', 'structure', 'description', 'image', 'bringWith'];

  const [service, setService] = useState<ServiceInfo | false | undefined>(false);
  const [serviceList, setServiceList] = useState<ServiceInfo[]>([]);
  const [serviceFields, setServiceFields] = useState<ServiceField[] | false | undefined>(false);

  /** Lade alle services von der activity ID */
  const getServiceList = async () => {
    const serviceListData = await getFireCollection(`activities/${data.title.form}/services/`, false);
    if (serviceListData) setServiceList(serviceListData);
  };

  /** Lade alle services von der activity ID */
  const generateFields = (select: ServiceInfo | undefined) => {
    if (!select) setServiceFields(undefined);
    const newFields: ServiceField[] = [];

    Object.entries(select || []).forEach(([name, values]: [string, any]) => {
      if (fields.includes(name)) {
        const isServiceName: boolean = name === 'serviceName';
        const answers: AnsDB[] = [{ name: (isServiceName && select?.serviceType) || name, amountOfFields: '1', values }];
        newFields.push({ name, answers });
      }
    });

    setServiceFields(newFields[0] ? newFields : undefined);
  };

  useEffect(() => { getServiceList(); }, [data]); // load servicelist

  const selectService = (select?: ServiceInfo) => {
    setService(select);
    generateFields(select); // load servicefields
  };

  const updateServiceFields = (newField: ServiceField) => {
    if (serviceFields) {
      const getIndex: number = serviceFields ? serviceFields.findIndex((x: ServiceField) => x.name === newField.name) : -1;
      if (getIndex > -1) {
        const newList = serviceFields;
        newList.splice(getIndex, 1, newField);
        return setServiceFields([...newList]);
      }
      return setServiceFields([...serviceFields, newField]);
    }

    return setServiceFields([newField]);
  };

  const updateServiceList = (newService?: ServiceInfo | false) => {
    if (newService) {
      const newList = serviceList || [];
      const findIndex: number = newList.findIndex((x) => x.id === newService.id);
      if (findIndex > -1) {
        newList.splice(findIndex, 1, newService);
      } else {
        newList.push(newService);
      }

      setServiceList([...newList]);
      console.log('neue lsite', [...newList]);
    }
  };

  const closeService = (newService?: ServiceInfo) => {
    updateServiceList(newService || service);
    setServiceFields(false);
    setService(false);
  };

  const saveQuestions = (newField: ServiceField) => {
    const isInitial = newField.name === 'serviceName';

    const getName: string | undefined = newField?.answers?.[0]?.name;
    const getServiceID: string = service && service.id ? service.id : `${getName}_${Date.now()}`;

    if (getName) {
      const updatedField: any = { ...(isInitial ? { id: getServiceID, serviceType: getName } : []), [newField.name]: newField.answers?.[0]?.values?.[0] };

      fireDocument(`activities/${activityID}/services/${getServiceID}`, updatedField, isInitial ? 'set' : 'update').then(() => {
        setService({ ...(!isInitial ? service : []), ...updatedField });
        updateServiceFields(newField);
        if (newField.name === 'image') setService(false);
      });
    }
  };

  const generateServiceLabel = (x: ServiceInfo): string => {
    if (!x.serviceName) return 'Noch keine Leistung angelegt';
    let percent = 0; Object.keys(x).forEach((f: string) => { if (fields.includes(f)) percent += 1; });
    return `${x.serviceName} (${(percent / ServiceQuestions.length) * 100}%)`;
  };

  return (
    <Fragment>
      <TextHeader icon={<Archive color="#0983fe" />} title="Leistungen konfigurieren" text="Definiere alle Angebote die du zur verfügung stellen willst. Du kannst Angebote mit gleicher Preis-Logik kombinieren, ansonsten müssen diese einzelnt angelegt werden. Um die Preise später korrekt bestimmen zu können." />

      <BackButton url={`/company/dashboard/${activityID}`} />
      <section class="group form small_size_holder">
        <Item type="grey" icon={<PlusCircle />} label="Hinzufügen" action={() => selectService(undefined)} />

        {serviceList?.map((x: ServiceInfo) => (
          <Item key={x.id} text={x.serviceType && serviceProps[x.serviceType].name} label={generateServiceLabel(x)} icon={x.serviceType && serviceProps[x.serviceType].icon} action={() => selectService(x)} />
        ))}
      </section>

      {service !== false && serviceFields !== false && (
      <Modal title="" close={() => closeService()} type="large">
        <QuestForm
          questions={ServiceQuestions}
          service={service}
          serviceFields={serviceFields}
          folderPath={`activities/${data.title.form}/services`}
          save={saveQuestions}
        />
      </Modal>
      )}
    </Fragment>
  );
};

export default Services;
