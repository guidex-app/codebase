import { IconCalendarTime } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import FabButton from '../../../components/fabButton';
import Modal from '../../../container/modal';
import { getFireCollection } from '../../../data/fire';
import { ServiceInfo } from '../../../interfaces/company';
import ReserveAvailable from './available';
import ReserveInfo from './info/info';

interface ReservationProps {
    activityID: string;
    openings: (string | false)[];
    uid?: string;
    day?: string;
}

const Reservation: FunctionalComponent<ReservationProps> = ({ activityID, openings, uid, day }: ReservationProps) => {
  const [selectedService, setSelectedService] = useState<ServiceInfo>();
  const [serviceList, setServiceList] = useState<ServiceInfo[] | false | undefined>(false);
  const [modalState, setModalState] = useState<'info' | 'available' | 'finished' | undefined>(undefined);

  const loadServiceList = async () => {
    const data = await getFireCollection(`activities/${activityID}/services/`, false, [['structureID', '!=', false]]);
    setServiceList(data);
  };

  useEffect(() => { loadServiceList(); }, [activityID]);

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
      {serviceList && (
        <ReserveInfo activityID={activityID} serviceList={serviceList} selectService={selectService} />
      )}
      {modalState && openings && serviceList && (
        <Modal title={modalState === 'available' ? `Verfügbarkeiten für ${selectedService?.serviceName || ''}` : ''} close={closeReserve} type={modalState === 'available' ? 'large' : undefined}>
          {modalState === 'info' && <ReserveInfo activityID={activityID} serviceList={serviceList} selectService={selectService} />}
          {modalState === 'available' && selectedService?.serviceName && <ReserveAvailable service={selectedService} uid={uid} activityID={activityID} openings={openings} changeState={setModalState} day={day} />}
        </Modal>
      )}
      <FabButton icon={<IconCalendarTime color="black" />} action={() => setModalState('info')} />
    </Fragment>
  );
};

export default Reservation;
