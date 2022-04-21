/* eslint-disable no-nested-ternary */
import { Fragment, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { route } from 'preact-router';
import { Archive, Dribbble, Home, PlusCircle, Users } from 'react-feather';

import BackButton from '../../../components/backButton';
import FormButton from '../../../components/form/basicButton';
import QuestForm from '../../../components/form/questForm';
import TextHeader from '../../../components/iconTextHeader';
import Item from '../../../components/item';
import Spinner from '../../../components/spinner';
import Modal from '../../../container/modal';
import { fireArray, fireDocument } from '../../../data/fire';
import useCompany from '../../../hooks/useCompany';
import useServiceList from '../../../hooks/useServiceList';
import { Activity } from '../../../interfaces/activity';
import { AnsDB, ServiceField, ServiceInfo } from '../../../interfaces/company';
import ServiceQuestions from './serviceQuestions';

interface ActivityProp {
    activityID: string;
    activity: Activity;
}

const Services: FunctionalComponent<ActivityProp> = ({ activity, activityID }: ActivityProp) => {
  const data: Activity | undefined = useCompany(activityID, activity);
  if (!data) return <TextHeader icon={<Archive color="#0983fe" />} title="Leistungen konfigurieren" text="Bitte füge alle angebotenen Leistungen hinzu" />;

  const serviceProps: { [key: string]: { name: 'Eintritt' | 'Verleihobjekt' | 'Raum/Bahn/Spiel', icon: any } } = {
    entry: { name: 'Eintritt', icon: <Users color="#63e6e1" /> }, object: { name: 'Verleihobjekt', icon: <Dribbble color="#d4be21" /> }, section: { name: 'Raum/Bahn/Spiel', icon: <Home color="#bf5bf3" /> },
  };

  const fields = ['serviceName', 'structure', 'description', 'image', 'bringWith'];

  const [service, setService] = useState<ServiceInfo | false | undefined>(false);
  const [serviceFields, setServiceFields] = useState<ServiceField[] | false | undefined>(false);

  const { serviceList, updateServiceList } = useServiceList(activityID);

  /** Lade alle services von der activity ID */
  const generateFields = (select: ServiceInfo | undefined) => {
    if (!select) setServiceFields(undefined);
    const newFields: ServiceField[] = [];

    Object.entries(select || []).forEach(([name, values]: [string, any]) => {
      if (fields.includes(name)) {
        const isServiceName: boolean = name === 'serviceName';
        const selected: AnsDB = { name: (isServiceName && select?.serviceType) || name, amountOfFields: '1', values };
        newFields.push({ name, selected });
      }
    });

    setServiceFields(newFields[0] ? newFields : undefined);
  };

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

  const closeService = (newService?: ServiceInfo) => {
    updateServiceList(newService);
    if (!serviceList) fireArray(`activities/${activityID}`, 'state', 'services', 'add');
    setServiceFields(false);
    setService(false);
  };

  const saveQuestions = (newField: ServiceField) => {
    const isInitial = newField.name === 'serviceName';

    const getName: string | undefined = newField?.selected?.name;
    const getServiceID: string = service && service.id ? service.id : `${getName}_${Date.now()}`;

    if (getName) {
      const updatedField: any = { ...(isInitial ? { id: getServiceID, serviceType: getName } : []), [newField.name]: newField.selected?.values?.[0] };

      fireDocument(`activities/${activityID}/services/${getServiceID}`, updatedField, isInitial ? 'set' : 'update').then(() => {
        const newService = { ...(!isInitial ? service : []), ...updatedField };
        if (newField.name === 'image') return closeService(newService);
        setService(newService);
        updateServiceFields(newField);
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
      <TextHeader icon={<Archive color="#0983fe" />} title="Leistungen konfigurieren" text="Bitte füge alle angebotenen Leistungen hinzu" />

      <BackButton url={`/company/dashboard/${activityID}`} />
      {serviceList !== false ? (
        <section class="group form small_size_holder">
          <Item type="grey" icon={<PlusCircle />} label="Leistung Hinzufügen" action={() => selectService(undefined)} />

          {serviceList?.map((x: ServiceInfo) => (
            <Item key={x.id} text={x.serviceType && serviceProps[x.serviceType].name} label={generateServiceLabel(x)} icon={x.serviceType && serviceProps[x.serviceType].icon} action={() => selectService(x)} />
          ))}
        </section>
      ) : <Spinner />}

      <FormButton action={() => route(`/company/prices/${data.title.form}`)} label="Speichern und weiter" />

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
