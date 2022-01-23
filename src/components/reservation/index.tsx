import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import Modal from '../../container/modal';
import { getFireCollection } from '../../data/fire';
import { ServiceInfo } from '../../interfaces/company';
import Item from '../item';
import ReserveAvailable from './available';
import ReserveInfo from './info/info';

interface ReservationProps {
    activityID: string;
    openings: (string | false)[];
}

const Reservation: FunctionalComponent<ReservationProps> = ({ activityID, openings }: ReservationProps) => {
  const [selectedService, setSelectedService] = useState<ServiceInfo>();
  const [serviceList, setServiceList] = useState<ServiceInfo[]>();
  const [modalState, setModalState] = useState<'info' | 'available' | 'confirm' | 'finished' | undefined>('info');

  const loadServiceList = () => {
    getFireCollection(`activities/${activityID}/services`, false).then((d) => {
      if (d) setServiceList(d);
    });
  };

  useEffect(() => {
    loadServiceList();
  }, [activityID]);

  const selectService = (x: ServiceInfo) => {
    setSelectedService(x);
  };

  const closeReserve = () => {
    setSelectedService(undefined);
    setModalState('info');
  };

  return (
    <Fragment>
      <section class="group form">
        <h3>Leistungen</h3>
        {serviceList?.map((x) => x.serviceNames?.map((serviceName, serviceIndex) => (
          <Item image={`https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/activities%2F${activityID}%2Fservices%2F${serviceName.replace(' ', '_').toLowerCase()}%2F${serviceName.replace(' ', '_').toLowerCase()}_250x200`} text={x.descriptions?.[serviceIndex]} label={serviceName} action={() => selectService(x)} />
        )))}
      </section>
      {!!selectedService && modalState && openings && (
        <Modal title={modalState === 'available' ? 'Verfügbarkeiten' : ''} close={closeReserve} type={modalState === 'available' ? 'large' : undefined}>
          {modalState === 'info' && <ReserveInfo service={selectedService} list={serviceList} changeState={setModalState} />}
          {['available', 'confirm'].includes(modalState) && selectedService?.serviceNames?.[0] && <ReserveAvailable service={selectedService} modalState={modalState} activityID={activityID} serviceName={selectedService?.serviceNames?.[0]} openings={openings} changeState={setModalState} />}
          {/*
          service: ServiceInfo;

    date: Date;
    durationList: { list: any; isRound: boolean; };
    duration: string;
    reservationTime: any;
    personAmount: number;
    amountRooms: number;
    foundation: 'persPrice' | 'objectPrice';
    changeState: (type?: 'info' | 'available' | 'confirm' | 'finished') => void; */}
        </Modal>
      )}
    </Fragment>
  );
};

export default Reservation;
