import { Fragment, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { UserPlus } from 'react-feather';

import FormButton from '../../../components/form/basicButton';
import Counter from '../../../components/form/counter';
import Item from '../../../components/item';
import { sumOf } from '../../../helper/array';

interface DiscountsProps {
    maxPersons: number;
    list: string[];
    values: { [key: string]: number };
    change: (value: { [key: string]: number }) => void;
}

const Discounts: FunctionalComponent<DiscountsProps> = ({ maxPersons, list, values, change }: DiscountsProps) => {
  const [valueList, setValueList] = useState<{ [key: string]: number }>(values);

  const generateNewAges = (value: number, key: string) => {
    const newValueList = { ...valueList, [key]: value };
    if (sumOf(Object.values(newValueList)) <= maxPersons) {
      setValueList(newValueList);
    }
  };

  const countUsedDiscounts = (): number => {
    if (!values) return 0;
    return sumOf(Object.values(valueList));
  };

  const save = () => change(valueList);

  return (
    <Fragment>
      <Item type="info" icon={<UserPlus />} label={`Verfügbar: ${maxPersons - countUsedDiscounts()} Pers.`} />

      {list.map((disc: string) => (
        <Counter
          label={disc.split('-')[1] ? `${disc} J.` : disc}
          name={disc}
          value={valueList[disc] || 0}
          min={0}
          max={maxPersons}
          large
          change={generateNewAges}
        />
      ))}

      <FormButton label="Speichern" action={save} />

    </Fragment>
  );
};

export default Discounts;
