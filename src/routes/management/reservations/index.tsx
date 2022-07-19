import { IconBrandDribbble, IconEye, IconHome, IconUser } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import BackButton from '../../../components/backButton';
import DaySlider from '../../../components/form/daySlider';
import TextHeader from '../../../components/infos/iconTextHeader';
import Item from '../../../components/item';
import Spinner from '../../../components/spinner';
import TopButton from '../../../components/topButton';
import Modal from '../../../container/modal';
import { getFireCollection } from '../../../data/fire';
import useCompany from '../../../hooks/useCompany';
import useServiceList from '../../../hooks/useServiceList';
import useTimeLine from '../../../hooks/useTimeLine';
import { Activity } from '../../../interfaces/activity';
import { ServiceInfo } from '../../../interfaces/company';
import { Reservation } from '../../../interfaces/reservation';
import Reservations from './editReservation/reservations';
import style from './style.module.css';

interface ReservationPageProps {
    activityID: string;
    activity: Activity;

}

const ReservationPage: FunctionalComponent<ReservationPageProps> = ({ activity, activityID }: ReservationPageProps) => {
  const data: Activity | undefined = useCompany(activityID, activity);
  const header = (
    <TextHeader
      icon={<IconEye color="#bf5bf3" />}
      title="Reservierungen"
      text="Die Verfügbarkeiten geben für jeder Ihrer definierten Leistungen, Kapazitäten für jeden Tag an. Sie Definieren somit wie viele und wann gebucht werden kann."
    />
  );
  if (!data) return header;
  const timeLine = useTimeLine(30, data.openings);

  // const formInit: FormInit = {
  //   defaultCapacity: { value: 10, type: 'number', required: false },
  //   defaultValue: { value: !!data.holidayOpenings, type: 'number', required: false },
  //   hasHolidays: { value: !!data.saisonalOpenings, type: 'boolean', required: false },
  //   storno: { type: 'string', required: false },
  // };

  const [selected, setSelected] = useState<ServiceInfo | false>(false);
  const { serviceList } = useServiceList(activityID);

  const [showReservationId, setShowReservationId] = useState<string | false>(false);
  const [, setReservationList] = useState<Reservation[]>();

  const closeReservation = () => setShowReservationId(false);
  const loadReservations = async () => {
    if (!selected) return;
    const list: Reservation[] | undefined = await getFireCollection(`activities/${activityID}/services/${selected.id}/reservations`, false, [['serviceName', '==', selected.serviceName]]);
    if (list) setReservationList(list);
  };

  useEffect(() => { if (selected) loadReservations(); }, [selected]);

  const serviceProps: { [key: string]: { name: 'Eintritt' | 'Verleihobjekt' | 'Raum/Bahn/Spiel', icon: any } } = {
    entry: { name: 'Eintritt', icon: <IconUser color="#63e6e1" /> }, object: { name: 'Verleihobjekt', icon: <IconBrandDribbble color="#d4be21" /> }, section: { name: 'Raum/Bahn/Spiel', icon: <IconHome color="#bf5bf3" /> },
  };

  return (
    <Fragment>
      {header}

      {selected ? (
        <main class="small_size_holder">
          <TopButton action={() => setSelected(false)} />
          <DaySlider change={() => console.log('')} name="day" openedDays={[]} />
          {timeLine.map((time: string) => (
            <div class={style.slot}>
              {time}
            </div>
          ))}
          {/* {reservationList?.map((r: Reservation) => <Item type="info" icon={<IconCalendar color="var(--orange)" />} label={`${r.serviceName} - ${r.startTime} (${r.duration})`} text={`${r.personAmount} Pers. (${r.totalPrice} €) (${r.uid})`} editLabel={`${r.reservationStatus?.state === 'active' ? 'Aktiv' : 'Abgesagt'}`} action={() => setShowReservationId(r.reservationId)} />)} */}
        </main>
      ) : (
        <main class="small_size_holder">
          <BackButton url={`/company/dashboard/${activityID}`} />
          {serviceList !== false ? (
            <section class="group form small_size_holder">
              {serviceList?.map((x: ServiceInfo) => (
                <Item key={x.id} text={x.serviceType && serviceProps[x.serviceType].name} label={x.serviceName || 'Nicht definiert'} icon={x.serviceType && serviceProps[x.serviceType].icon} action={() => setSelected(x)} />
              ))}
            </section>
          ) : <Spinner />}
        </main>
      )}

      {showReservationId && selected && (
        <Modal title="Reservierungen bearbeiten" close={closeReservation} type="large">
          <Reservations
            activityId={activityID}
            document={`activities/${activityID}/services/${selected.id}/reservations/${showReservationId}`}
          />
        </Modal>
      )}
    </Fragment>
  );
};

export default ReservationPage;
