import { IconCheck } from '@tabler/icons';
import { FunctionalComponent, h } from 'preact';

import Chip from '../../chip';
import ErrorMessage from '../errorMessage';
import style from './style.module.css';

interface PickInputProps {
    label: string;
    name: string;
    options: string[];
    value?: string[];
    multi?: true;
    required?: true;
    showError?: boolean;
    change: (value: any, key: string) => void,
}

const PickInput: FunctionalComponent<PickInputProps> = ({ label, options, name, multi, showError, required, value = [], change }: PickInputProps) => {
  const changeValue = (newValue: string, indx: number) => {
    if (!multi) return change(newValue, name);

    const newValues = value;
    if (indx !== -1) {
      newValues.splice(indx, 1);
    } else {
      newValues.push(newValue);
    }

    change(newValues, name);
  };

  return (
    <div class={style.container}>
      <div class={value ? style.valid : style.invalid}>
        <label>{required && '*'}{label}</label>
        {options.map((item: string) => {
          const itemIndex: number = value?.indexOf(item);
          return (
            <Chip label={item} icon={<IconCheck />} type={itemIndex !== -1 ? 'active' : 'inactive'} size="medium" key={item} action={() => changeValue(item, itemIndex)} />
          );
        })}
      </div>
      <ErrorMessage show={!!showError} message="Gebe mindestens einen Wert an" />
    </div>
  );
};

export default PickInput;
