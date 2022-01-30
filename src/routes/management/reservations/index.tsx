import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Columns } from 'react-feather';
import BackButton from '../../../components/backButton';
import SelectInput from '../../../components/form/selectInput';
import TextHeader from '../../../components/iconTextHeader';
import Modal from '../../../container/modal';
import { getFireCollection } from '../../../data/fire';
import useCompany from '../../../hooks/useCompany';
import { Activity } from '../../../interfaces/activity';
import { ServiceInfo } from '../../../interfaces/company';
import Reservations from './reservations';

interface ActivityProp {
    activityID: string;
    activity: Activity;
    uid: string;
}

const Reservation: FunctionalComponent<ActivityProp> = ({ activity, activityID, uid }: ActivityProp) => {
  const data = useCompany(activityID, activity);
  if (!data || !uid) {
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
  const [selectList, setSelectList] = useState<ServiceInfo[] | false>(false);
  const [showReservation, setShowReservation] = useState(false);

  const loadListData = () => {
    getFireCollection(`activities/${data.title.form}/services/`, false, [['serviceName', '!=', false]]).then((listData: ServiceInfo[]) => {
      if (listData) setSelectList(listData);
    });
  };

  const changeSelect = (value: string) => {
    setSelected(selectList ? selectList?.find((x: ServiceInfo) => x.serviceName === value) || false : false);
  };

  const toggleShowReservation = () => setShowReservation(!showReservation);

  useEffect(() => { if (data.title.form) loadListData(); }, [data]);

  return (
    <Fragment>
      <TextHeader
        icon={<Columns color="#bf5bf3" />}
        title="Reservierungen"
        text="Die Verfügbarkeiten geben für jeder Ihrer definierten Leistungen, Kapazitäten für jeden Tag an. Sie Definieren somit wie viele und wann gebucht werden kann."
      />
      <main class="small_size_holder">
        <BackButton url={`/company/dashboard/${activityID}`} />
        {selectList !== false && (
          <SelectInput
            label="Wähle eine Leistung:"
            name="select"
            value={selected ? selected?.serviceName : undefined}
            options={selectList.map((x: any) => x.serviceName)}
            error={selected !== false ? 'valid' : 'invalid'}
            required
            change={changeSelect}
          />
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
