import { IconCheck } from '@tabler/icons';
import { FunctionalComponent, h } from 'preact';

import Chip from '../../chip';
import style from './style.module.css';

interface PickInputProps {
    label: string;
    name: string;
    options: string[];
    value?: string[];
    error?: 'invalid' | 'error' | 'valid';
    required?: true;
    change: (value: any, key: string, itemIndex?: number | undefined) => void,
}

const PickInput: FunctionalComponent<PickInputProps> = ({ label, options, name, error, required, value = [], change }: PickInputProps) => (
  <div class={style.container}>
    <div class={error ? style[error] : ''}>
      <label>{required && '*'}{label}</label>
      {options.map((item: string) => {
        const itemIndex: number = value?.indexOf(item);
        return (
          <Chip label={item} icon={<IconCheck />} type={itemIndex !== -1 ? 'active' : 'inactive'} key={item} action={() => change(item, name, itemIndex)} />
        );
      })}
    </div>
    {error === 'error' && <small class={style.errorMessage}>Bitte mache eine korrekte eingabe</small>}
  </div>
);

export default PickInput;
