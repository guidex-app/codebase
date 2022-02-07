import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Calendar } from 'react-feather';

import FabButton from '../../../components/fabButton';
import Item from '../../../components/item';
import Modal from '../../../container/modal';
import { getFireCollection } from '../../../data/fire';
import { ServiceInfo } from '../../../interfaces/company';
import ReserveAvailable from './available';
import ReserveInfo from './info/info';

interface ReservationProps {
    activityID: string;
    openings: (string | false)[];
}

const Reservation: FunctionalComponent<ReservationProps> = ({ activityID, openings }: ReservationProps) => {
  const [selectedService, setSelectedService] = useState<ServiceInfo>();
  const [serviceList, setServiceList] = useState<ServiceInfo[]>();
  const [modalState, setModalState] = useState<'info' | 'available' | 'finished' | undefined>(undefined);

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
        <Modal title={modalState === 'available' ? `Verfügbarkeiten für ${selectedService?.serviceName || ''}` : ''} close={closeReserve} type={modalState === 'available' ? 'large' : undefined}>
          {modalState === 'info' && <ReserveInfo service={selectedService} list={serviceList} changeState={setModalState} />}
          {modalState === 'available' && selectedService?.serviceName && <ReserveAvailable service={selectedService} activityID={activityID} openings={openings} changeState={setModalState} />}
        </Modal>
      )}
      <FabButton icon={<Calendar color="black" />} action={() => setModalState('info')} />
    </Fragment>
  );
};

export default Reservation;
