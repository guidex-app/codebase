import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { Calendar, Columns, Dribbble, Home, Users } from 'react-feather';

import BackButton from '../../../components/backButton';
import FormButton from '../../../components/form/basicButton';
import Counter from '../../../components/form/counter';
import PickInput from '../../../components/form/pickInput';
import TextHeader from '../../../components/iconTextHeader';
import Item from '../../../components/item';
import Modal from '../../../container/modal';
import { fireDocument } from '../../../data/fire';
import { mergeUnique } from '../../../helper/array';
import useCompany from '../../../hooks/useCompany';
import useForm from '../../../hooks/useForm';
import useServiceList from '../../../hooks/useServiceList';
import { Activity } from '../../../interfaces/activity';
import { ServiceInfo } from '../../../interfaces/company';
import { FormInit } from '../../../interfaces/form';
import Capacity from './capacity';

interface ActivityProp {
    activityID: string;
    activity: Activity;
    uid: string;
}

const Availabilities: FunctionalComponent<ActivityProp> = ({ activity, activityID, uid }: ActivityProp) => {
  const data = useCompany(activityID, activity);
  if (!data || !uid) {
    return (
      <TextHeader
        icon={<Columns color="#bf5bf3" />}
        title="Verfügbarkeiten"
        text="Die Verfügbarkeiten geben für jeder Ihrer definierten Leistungen, Kapazitäten für jeden Tag an. Sie Definieren somit wie viele und wann gebucht werden kann."
      />
    );
  }

  const formInit: FormInit = {
    countMinPerson: { value: 1, type: 'number', required: false },
    countMaxRoomPerson: { value: 10, type: 'number', required: false },

    leadTimeInMin: { value: 30, type: 'number', required: false },
    minAge: { value: 1, type: 'number', required: false },

    defaultCapacity: { value: 10, type: 'number', required: true },
    storno: { value: '24 Std.', type: 'string', required: false },
  };
  const { fields, formState, changeField, isValid } = useForm(formInit);

  const [selected, setSelected] = useState<ServiceInfo | false>(false);
  const { serviceList } = useServiceList(activityID);
  const [showCapacity, setShowCapacity] = useState(false);

  const toggleShowCapacity = () => setShowCapacity(!showCapacity);

  useEffect(() => { if (!serviceList?.[1] && serviceList?.[0]) setSelected(serviceList[0]); }, [serviceList]);

  const validateForm = () => {
    if (selected && selected.id && isValid()) {
      fireDocument(`activities/${activityID}/available/${selected.id}`, fields, 'set').then(() => {
        if (!data.state?.includes('available')) fireDocument(`activities/${activityID}`, { online: false, state: mergeUnique(['available'], data.state) }, 'update');
        route(`/company/dashboard/${activityID}`);
      });
    }
  };

  const serviceProps: { [key: string]: { name: 'Eintritt' | 'Verleihobjekt' | 'Raum/Bahn/Spiel', icon: any } } = {
    entry: { name: 'Eintritt', icon: <Users color="#63e6e1" /> }, object: { name: 'Verleihobjekt', icon: <Dribbble color="#d4be21" /> }, section: { name: 'Raum/Bahn/Spiel', icon: <Home color="#bf5bf3" /> },
  };

  return (
    <Fragment>
      <TextHeader
        icon={<Columns color="#bf5bf3" />}
        title="Verfügbarkeiten"
        text="Die Verfügbarkeiten geben für jeder Ihrer definierten Leistungen, Kapazitäten für jeden Tag an. Sie Definieren somit wie viele und wann gebucht werden kann."
      />
      <main class="small_size_holder">
        <BackButton url={`/company/dashboard/${activityID}`} />
        {serviceList !== undefined && !selected && (
          <section class="group form small_size_holder">
            {serviceList?.map((x: ServiceInfo) => (
              <Item key={x.id} text={x.serviceType && serviceProps[x.serviceType].name} label={x.serviceName || 'Nicht definiert'} icon={x.serviceType && serviceProps[x.serviceType].icon} action={() => setSelected(x)} />
            ))}
          </section>
        )}

        {selected !== false && (
          <Fragment>
            <form>
              <section class="group form">
                <h3>Kapazitäten</h3>
                <Counter
                  label="Mindest Personenanzahl"
                  name="countMinPerson"
                  value={fields.countMinPerson}
                  required
                  change={changeField}
                />
                {selected.serviceType !== 'entry' && (
                <Counter
                  label="Maximale Personenanzahl"
                  name="countMaxRoomPerson"
                  value={fields.countMaxRoomPerson}
                  required
                  change={changeField}
                />
                )}
              </section>

              <section class="group form">
                <h3>Reservierung</h3>

                <Counter label="Vorlaufzeit (Minuten)" name="leadTimeInMin" value={fields.leadTimeInMin} change={changeField} />
                <Counter label="Welches Mindestalter ist erforderlich" name="minAge" value={fields.minAge} change={changeField} />

                <PickInput
                  label="Stornierungs-Möglichkeiten"
                  name="storno"
                  options={['48 Std.', '24 Std.', '12 Std.', '8 Std.', '1 Std.', 'Nicht möglich']}
                  value={[fields.storno]}
                  error={formState.storno}
                  required
                  change={changeField}
                />
              </section>

              <section class="group form">
                <h3>Anzahl der Verfügbarkeiten</h3>

                <Counter label="Standartverfügbarkeiten" name="defaultCapacity" value={fields.defaultCapacity} change={changeField} />
                <Item icon={<Calendar />} label="Individuell konfigurieren (Tag / Uhrzeit)" text="Klicke um für bestimmte Uhrzeiten oder Tage eine Individuelle verfügbarkeit anzugeben" type="grey" action={toggleShowCapacity} />
              </section>
            </form>

            <FormButton label="Speichern" action={validateForm} />
          </Fragment>
        )}

      </main>
      {showCapacity && data.openings && selected && selected.id && (
        <Modal title="Kapazitäten bearbeiten" close={toggleShowCapacity} type="large">
          <Capacity
            openings={data.openings}
            activityID={activityID}
            serviceID={selected.id}
            defaultValue={fields.defaultCapacity || 10}
          />
        </Modal>
      )}
    </Fragment>
  );
};

export default Availabilities;
