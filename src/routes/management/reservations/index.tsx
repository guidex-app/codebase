import { Fragment, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { Columns, Dribbble, Home, Users } from 'react-feather';

import BackButton from '../../../components/backButton';
import TextHeader from '../../../components/iconTextHeader';
import Item from '../../../components/item';
import Modal from '../../../container/modal';
import useCompany from '../../../hooks/useCompany';
import useServiceList from '../../../hooks/useServiceList';
import { Activity } from '../../../interfaces/activity';
import { ServiceInfo } from '../../../interfaces/company';
import Reservations from './reservations';

interface ActivityProp {
    activityID: string;
    activity: Activity;
}

const Reservation: FunctionalComponent<ActivityProp> = ({ activity, activityID }: ActivityProp) => {
  const data: Activity | undefined = useCompany(activityID, activity);
  if (!data) {
    return (
      <TextHeader
        icon={<Columns color="#bf5bf3" />}
        title="Reservierungen"
        text="Die Verfügbarkeiten geben für jeder Ihrer definierten Leistungen, Kapazitäten für jeden Tag an. Sie Definieren somit wie viele und wann gebucht werden kann."
      />
    );
  }

  // const formInit: FormInit = {
  //   defaultCapacity: { value: 10, type: 'number', required: false },
  //   defaultValue: { value: !!data.holidayOpenings, type: 'number', required: false },
  //   hasHolidays: { value: !!data.saisonalOpenings, type: 'boolean', required: false },
  //   storno: { type: 'string', required: false },
  // };

  const [selected, setSelected] = useState<ServiceInfo | false>(false);
  const { serviceList } = useServiceList(activityID);
  const [showReservation, setShowReservation] = useState(false);

  const toggleShowReservation = () => setShowReservation(!showReservation);

  const serviceProps: { [key: string]: { name: 'Eintritt' | 'Verleihobjekt' | 'Raum/Bahn/Spiel', icon: any } } = {
    entry: { name: 'Eintritt', icon: <Users color="#63e6e1" /> }, object: { name: 'Verleihobjekt', icon: <Dribbble color="#d4be21" /> }, section: { name: 'Raum/Bahn/Spiel', icon: <Home color="#bf5bf3" /> },
  };

  return (
    <Fragment>
      <TextHeader
        icon={<Columns color="#bf5bf3" />}
        title="Reservierungen"
        text="Die Verfügbarkeiten geben für jeder Ihrer definierten Leistungen, Kapazitäten für jeden Tag an. Sie Definieren somit wie viele und wann gebucht werden kann."
      />
      <main class="small_size_holder">
        <BackButton url={`/company/dashboard/${activityID}`} />
        {serviceList !== false && (
          <section class="group form small_size_holder">
            {serviceList?.map((x: ServiceInfo) => (
              <Item key={x.id} text={x.serviceType && serviceProps[x.serviceType].name} label={x.serviceName || 'Nicht definiert'} icon={x.serviceType && serviceProps[x.serviceType].icon} action={() => setSelected(x)} />
            ))}
          </section>
        )}

      </main>
      {showReservation && selected && (
        <Modal title="Reservierungen bearbeiten" close={toggleShowReservation} type="large">
          <Reservations
            openings={data.openings}
            collection={`activities/${activityID}/availabilities/${selected.id}/rows`}
          />
        </Modal>
      )}
    </Fragment>
  );
};

export default Reservation;
