/* eslint-disable no-nested-ternary */
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { Archive, Box, Circle, Home, PlusCircle } from 'react-feather';
import BackButton from '../../../components/backButton';
import QuestForm from '../../../components/form/questForm';

import Item from '../../../components/item';
import TextHeader from '../../../components/iconTextHeader';
import Modal from '../../../container/modal';
import { fireDocument, getFireCollection } from '../../../data/fire';
import { mergeUnique } from '../../../helper/array';
import useCompany from '../../../hooks/useCompany';
import { Activity } from '../../../interfaces/activity';
import { AnsDB, ServiceField, ServiceInfo } from '../../../interfaces/company';
import ServiceQuestions from './serviceQuestions';
import FormButton from '../../../components/form/basicButton';

interface ActivityProp {
    activityID: string;
    activity: Activity;
    uid: string;
}

const Services: FunctionalComponent<ActivityProp> = ({ activity, activityID, uid }: ActivityProp) => {
  const data = useCompany(activityID, activity);
  if (!data || !uid) return <TextHeader icon={<Archive color="#0983fe" />} title="Leistungen konfigurieren" text="Definiere alle Angebote die du zur verfügung stellen willst" />;

  const serviceProps: { [key: string]: { name: 'Eintritt' | 'Verleihobjekt' | 'Raum/Bereich', icon: any } } = {
    entry: { name: 'Eintritt', icon: <Home /> }, object: { name: 'Verleihobjekt', icon: <Box /> }, roundGames: { name: 'Raum/Bereich', icon: <Circle /> },
  };

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
    const fields = ['serviceType', 'serviceNames', 'structure', 'descriptions', 'images'];
    const newFields: ServiceField[] = [];
    const getType: string | undefined = (select && select.serviceType) || undefined;

    Object.entries(select || []).forEach(([name, values]: [string, any]) => {
      if (fields.includes(name)) {
        const isType: boolean = name === 'serviceType';
        const isNames = name === 'serviceNames';
        const getName = isType ? values : (isNames ? getType : name);
        const amountOfFields = isType ? '1' : (values.map((x: string, i: number) => x && i + 1)).toString();
        const answers: AnsDB[] = [{ amountOfFields, name: getName, ...(!isType && { values }) }];
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
    const isServiceType: boolean = newField.name === 'serviceType';
    const serviceType: string | undefined = isServiceType ? newField?.answers?.[0]?.name : undefined;

    const getServiceID: string = service && service.id ? service.id : `${serviceType}_${Date.now()}`;
    const isDifferentServiceType: boolean = !!(service && serviceType && serviceType !== service.serviceType);
    const structure: string[] = service ? (service?.structure?.includes(newField.name) ? service.structure : [...(service.structure || []), newField.name]) : [newField.name];
    const newFieldData = { [newField.name]: newField.answers?.[0]?.[newField.name === 'serviceType' ? 'name' : 'values'], ...(((!service && isServiceType) || isDifferentServiceType) && { id: getServiceID }), structure };

    fireDocument(`activities/${data.title.form}/services/${getServiceID}`, newFieldData, !service || isDifferentServiceType ? 'set' : 'update').then(() => {
      const allFields: ServiceInfo = { ...(service && service), ...newFieldData };
      if (newField.name === 'images') return closeService(allFields);
      // update serviceInfo
      setService(((!service && isServiceType) || isDifferentServiceType) ? newFieldData : allFields);

      // aktuellen felder updaten
      if (isDifferentServiceType) {
        setServiceFields([newField]); // hard reset bei neuem type
      } else {
        updateServiceFields(newField);
      }

      if (!service && serviceType) {
        fireDocument(`activities/${data.title.form}`, { online: false, state: mergeUnique(['service'], data.state) }, 'update');
      }
    });
  };

  const generateServiceLabel = (x: ServiceInfo): string => {
    const serviceKeys: string[] = Object.keys(x);
    const percent: number = ((serviceKeys.length - 1) / (ServiceQuestions.length + 1)) * 100;
    const notDefined = `Noch keine ${x.serviceType && `${serviceProps[x.serviceType].name}e`} definiert`;
    const serviceNames = x.serviceNames ? x.serviceNames.toString() : notDefined;

    return `${serviceNames} (${percent}%)`;
  };

  const nextRoute = () => route(`/company/structure/${activityID}`);

  return (
    <Fragment>
      <TextHeader icon={<Archive color="#0983fe" />} title="Leistungen konfigurieren" text="Definiere alle Angebote die du zur verfügung stellen willst. Du kannst Angebote mit gleicher Preis-Logik kombinieren, ansonsten müssen diese einzelnt angelegt werden. Um die Preise später korrekt bestimmen zu können." />
      <main class="small_size_holder">
        <BackButton url={`/company/dashboard/${activityID}`} />
        <section class="group form">
          <h3>Deine Leistungsgruppen</h3>
          <Item type="grey" icon={<PlusCircle />} label="Hinzufügen" action={() => selectService(undefined)} />

          {serviceList?.map((x: ServiceInfo) => <Item key={x.id} label={generateServiceLabel(x)} icon={x.serviceType && serviceProps[x.serviceType].icon} action={() => selectService(x)} />)}
        </section>

        <FormButton label="Weiter zur Preis-Logik" action={nextRoute} />
      </main>
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
