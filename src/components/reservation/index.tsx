import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Calendar } from 'react-feather';
import Modal from '../../container/modal';
import { getFireCollection } from '../../data/fire';
import { ServiceInfo } from '../../interfaces/company';
import FabButton from '../fabButton';
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
  const [modalState, setModalState] = useState<'info' | 'available' | 'confirm' | 'finished' | undefined>(undefined);

  const loadServiceList = () => {
    getFireCollection(`activities/${activityID}/services/`, false, [['structureID', '!=', false]]).then((d) => {
      if (d) setServiceList(d);
    });
  };

  useEffect(() => {
    loadServiceList();
  }, [activityID]);

  const selectService = (x: ServiceInfo) => {
    setSelectedService(x);
    setModalState('available');
  };

  const closeReserve = () => {
    setSelectedService(undefined);
    setModalState(undefined);
  };

  return (
    <Fragment>
      <section class="group form">
        <h3>Leistungen</h3>
        {serviceList?.map((x) => (
          <Item image="https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/categories%2Fautokino%2Fautokino_250x200" text={x.description || 'Verfügbarkeit Checken'} label={x.serviceName || ''} action={() => selectService(x)} />
        ))}
      </section>
      {modalState && openings && (
        <Modal title={modalState === 'available' ? 'Verfügbarkeiten' : ''} close={closeReserve} type={modalState === 'available' ? 'large' : undefined}>
          {modalState === 'info' && <ReserveInfo service={selectedService} list={serviceList} changeState={setModalState} />}
          {['available', 'confirm'].includes(modalState) && selectedService?.serviceName && <ReserveAvailable service={selectedService} modalState={modalState} activityID={activityID} openings={openings} changeState={setModalState} />}
        </Modal>
      )}
      <FabButton icon={<Calendar />} action={() => setModalState('info')} />
    </Fragment>
  );
};

export default Reservation;
