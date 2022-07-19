import { IconAlarm, IconArchive, IconBox, IconCalendar, IconClock, IconHourglass, IconUserPlus } from '@tabler/icons';
import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import FormButton from '../../../../components/form/basicButton';
import Item from '../../../../components/item';
import Spinner from '../../../../components/spinner';
import { getFireDocument } from '../../../../data/fire';
import { getSimpleDateString } from '../../../../helper/date';
import { Reservation } from '../../../../interfaces/reservation';

interface CapacityProps {
    document: string;
    activityId: string;
}

const Reservations: FunctionalComponent<CapacityProps> = ({ document, activityId }: CapacityProps) => {
  const [resDoc, setResDoc] = useState<Reservation | undefined | false>(false);

  const loadReservation = async () => {
    console.log(document);
    const getDoc = await getFireDocument(document);
    setResDoc(getDoc || undefined);
  };

  const storno = () => {
    console.log('storno', activityId);
    // reservStorno(`activities/${activityId}/services/${resDoc.ser}/`);
  };

  useEffect(() => { loadReservation(); }, []);

  if (resDoc === false) return <Spinner />;
  if (resDoc === undefined) return <Item type="warning" label="Nicht gefunden" />;

  return (
    <div style={{ padding: '10px' }}>

      <section class="group form">
        <Item icon={<IconArchive />} label="Leistung" text={resDoc.serviceName} />
        <Item icon={<IconUserPlus />} label={`${resDoc.personAmount} Pers.`} text={`${resDoc.rooms}`} />
        {resDoc.rooms && resDoc.rooms > 1 && <Item icon={<IconBox />} label={`${resDoc.rooms} Räume`} />}
        <Item icon={<IconCalendar />} label="Datum" text={getSimpleDateString(new Date(resDoc.date[0]))} />
        <Item icon={<IconClock />} label="Uhrzeit" text={`${resDoc.startTime} Uhr`} />
        {resDoc.rounds && <Item icon={<IconAlarm />} label="Runden" text={`${resDoc.rounds} Runden`} />}
        <Item icon={<IconHourglass />} label="Dauer" text={`${resDoc.duration}`} />
      </section>

      <FormButton label="Stornieren" action={storno} />

    </div>
  );
};

export default Reservations;
