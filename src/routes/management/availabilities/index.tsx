import { IconBrandDribbble, IconCalendar, IconDoorEnter, IconHome, IconInfoCircle, IconUser } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';

import BackButton from '../../../components/backButton';
import FormButton from '../../../components/form/basicButton';
import Counter from '../../../components/form/counter';
import PickInput from '../../../components/form/pickInput';
import TextHeader from '../../../components/infos/iconTextHeader';
import Item from '../../../components/item';
import Spinner from '../../../components/spinner';
import Modal from '../../../container/modal';
import { fireDocument } from '../../../data/fire';
import { mergeUnique } from '../../../helper/array';
import useCompany from '../../../hooks/useCompany';
import useForm from '../../../hooks/useForm';
import useServiceList from '../../../hooks/useServiceList';
import { Activity } from '../../../interfaces/activity';
import { ServiceInfo } from '../../../interfaces/company';
import Capacity from './capacity';

interface ActivityProp {
    activityID: string;
    activity: Activity;
}

const Availabilities: FunctionalComponent<ActivityProp> = ({ activity, activityID }: ActivityProp) => {
  const data: Activity | undefined = useCompany(activityID, activity);
  const header = (
    <TextHeader
      icon={<IconDoorEnter color="#bf5bf3" />}
      title="Verfügbarkeiten"
      text="Die Verfügbarkeiten geben für jeder Ihrer definierten Leistungen, Kapazitäten für jeden Tag an. Sie Definieren somit wie viele und wann gebucht werden kann."
    />
  );
  if (!data) return header;

  const { form, changeForm, isValid } = useForm({
    countMinPerson: 1,
    countMaxRoomPerson: 10,
    leadTimeInMin: 30,
    minAge: 1,
    defaultCapacity: 10,
    storno: '24 Std.',
  }, ['countMinPerson', 'leadTimeInMin', 'minAge', 'defaultCapacity', 'storno']);

  const [selected, setSelected] = useState<ServiceInfo | false>(false);
  const { serviceList } = useServiceList(activityID);
  const [showCapacity, setShowCapacity] = useState(false);

  const toggleShowCapacity = () => setShowCapacity(!showCapacity);

  useEffect(() => { if (serviceList !== false && !serviceList?.[1] && serviceList?.[0]) setSelected(serviceList[0]); }, [serviceList]);

  const validateForm = () => {
    if (selected && selected.id && isValid) {
      fireDocument(`activities/${activityID}/available/${selected.id}`, form, 'set').then(() => {
        if (!data.state?.includes('available')) fireDocument(`activities/${activityID}`, { online: false, state: mergeUnique(['available'], data.state) }, 'update');
        route(`/company/dashboard/${activityID}`);
      });
    }
  };

  const serviceProps: { [key: string]: { name: 'Eintritt' | 'Verleihobjekt' | 'Raum/Bahn/Spiel', capacityText: string, icon: any } } = {
    entry: { name: 'Eintritt', icon: <IconUser color="#63e6e1" />, capacityText: 'Verfügbare Eintrittskarten (Personen)' }, object: { name: 'Verleihobjekt', icon: <IconBrandDribbble color="#d4be21" />, capacityText: 'Verfügbare Objekte ' }, section: { name: 'Raum/Bahn/Spiel', icon: <IconHome color="#bf5bf3" />, capacityText: 'Verfügbare Räume/Bahnen/Spiele' },
  };

  return (
    <Fragment>
      {header}
      <main class="small_size_holder">
        <BackButton url={`/company/dashboard/${activityID}`} />

        {data.openings ? (
          <Fragment>

            {serviceList === false && <Spinner />}

            {serviceList !== false && !selected && (
            <section class="group form small_size_holder">
              {serviceList?.map((x: ServiceInfo) => (
                <Item key={x.id} text={x.serviceType && serviceProps[x.serviceType].name} label={x.serviceName || 'Nicht definiert'} icon={x.serviceType && serviceProps[x.serviceType].icon} action={() => setSelected(x)} />
              ))}
            </section>
            )}

            {selected !== false && selected && (
            <Fragment>
              <form>
                <section class="group form">
                  <h3>Kapazitäten</h3>
                  <Counter
                    label="Mindest Personenanzahl"
                    name="countMinPerson"
                    value={form.countMinPerson}
                    required
                    change={changeForm}
                  />
                  {selected.serviceType !== 'entry' && (
                  <Counter
                    label="Maximale Personenanzahl pro Raum/Bahn/Spiel/Objekt"
                    name="countMaxRoomPerson"
                    value={form.countMaxRoomPerson}
                    required
                    change={changeForm}
                  />
                  )}
                </section>

                <section class="group form">
                  <h3>Reservierung</h3>

                  <Counter label="Vorlaufzeit (Minuten)" name="leadTimeInMin" value={form.leadTimeInMin} change={changeForm} />
                  <Counter label="Welches Mindestalter ist erforderlich" name="minAge" value={form.minAge} change={changeForm} />

                  <PickInput
                    label="Stornierungs-Möglichkeiten"
                    name="storno"
                    options={['48 Std.', '24 Std.', '12 Std.', '8 Std.', '1 Std.', 'Nicht möglich']}
                    value={[form.storno]}
                    required
                    change={changeForm}
                  />
                </section>

                <section class="group form">
                  <h3>Anzahl der Verfügbarkeiten</h3>

                  <Counter label={serviceProps[selected.serviceType || 'entry'].capacityText} name="defaultCapacity" value={form.defaultCapacity} change={changeForm} />
                  <Item icon={<IconCalendar />} label="Individuell konfigurieren (Tag / Uhrzeit)" text="Klicke um für bestimmte Uhrzeiten oder Tage eine Individuelle verfügbarkeit anzugeben" type="grey" action={toggleShowCapacity} />
                </section>
              </form>

              <FormButton label="Speichern" action={validateForm} />
            </Fragment>
            )}
          </Fragment>
        ) : (
          <Item icon={<IconInfoCircle color="var(--orange)" />} type="info" label="Bitte definiere zuerst die Öffnungszeiten" text="Die Öffnungszeiten sind erforderlich um die Verfügbarkeiten zu definieren" />
        )}

      </main>
      {showCapacity && data.openings && selected && selected.id && selected.serviceType && (
        <Modal title="Kapazitäten bearbeiten" close={toggleShowCapacity} type="large">
          <Capacity
            openings={data.openings}
            activityID={activityID}
            serviceID={selected.id}
            serviceType={selected.serviceType}
            defaultValue={form.defaultCapacity || 10}
          />
        </Modal>
      )}
    </Fragment>
  );
};

export default Availabilities;
