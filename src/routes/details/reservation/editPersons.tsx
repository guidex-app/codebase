import { Fragment, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';

import Counter from '../../../components/form/counter';

interface EditPersonsProps {
    maxPersons?: number;
    ageList?: string[];
    value: any;
    change: (value: number, key: string) => void;
}

const EditPersons: FunctionalComponent<EditPersonsProps> = ({ maxPersons, ageList, value, change }: EditPersonsProps) => {
  const [showSelect, setShowSelect] = useState(false);

  const presentSelect = () => {
    setShowSelect(true);
  };

  const generateNewAges = (value: number, age: string) => {
    change(value, 'personAmount');
  };

  const getAllNumbers = (): number => {
    if (value) {
      let newCount: number = 0;
      const newObjects: number[] = Object.values(value);
      for (let index = 0; index < newObjects.length; index += 1) {
        if (newObjects?.[index]) newCount = newObjects[index] + newCount;
      }
      return newCount;
    }
    return 0;
  };

  return (
    <Fragment>
      {/* <h1>Reserviere ein Leistung</h1> */}
      <p class="grey" style={{ textAlign: 'center' }}>Für 2 Räume reservieren. Maximal: {maxPersons || 1}</p>

              {ageList?.map((age: string) => (
                <Counter
                label={age}
                name={age}
                type="large"
                value={1}
                min={1}
                max={maxPersons || 1}
                change={generateNewAges}
              />
              ))}

    </Fragment>
  );
};

export default EditPersons;

