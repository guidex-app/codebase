import { Fragment, FunctionalComponent, h } from 'preact';

import Counter from '../../../components/form/counter';

interface EditPersonsProps {
    countMaxRoomPerson?: number;
}

const EditPersons: FunctionalComponent<EditPersonsProps> = ({ countMaxRoomPerson }: EditPersonsProps) => {
  const calculateRooms = (): number => {
    console.log('s');
    return 1;
  };

  return (
    <Fragment>
      <h1>Reserviere ein Leistung</h1>
      <p class="grey">Für {calculateRooms()} Räume reservieren</p>

      <Counter
        label={`Wie viele Personen? (max.: ${countMaxRoomPerson || 1} Pers.)`}
        name="personAmount"
        type="large"
        value={1}
        min={1}
        max={countMaxRoomPerson || 1}
        change={() => console.log('s')}
      />
    </Fragment>
  );
};

export default EditPersons;
