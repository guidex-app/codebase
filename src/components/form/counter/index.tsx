/* eslint-disable jsx-a11y/control-has-associated-label */
import { IconMinus, IconPlus } from '@tabler/icons';
import { FunctionalComponent, h } from 'preact';

import style from './style.module.css';

interface CounterProps {
    label: string;
    name: string;
    value?: number;
    group?: true;
    min?: number;
    max?: number;
    steps?: number;
    icon?: any;
    required?: true;
    text?: string;
    large?: true;
    change: (value: any, key: string) => void,
}

const Counter: FunctionalComponent<CounterProps> = ({ label, icon, text, group, name, required, min = 1, large, max = 10000, value = 0, steps = 1, change }: CounterProps) => {
  const newValue = (typ: 'add' | 'remove') => {
    const checkAdd: boolean = typ === 'add' && (+value + steps) <= max;
    const checkRemove: boolean = typ === 'remove' && (+value - steps) >= min;
    if (checkAdd || checkRemove) change(typ === 'add' ? (+value + steps) : (+value - steps), name);
  };

  const setValue = (e: any) => {
    const getValue: any = e.target.value;
    change(getValue, name);
  };

  return (
    <div class={`${style.counter} ${large ? style.large : ''} ${group ? style.group : ''}`}>
      {icon && icon}
      <label for={name}>{required && '*'}{label}&nbsp; {text && <small>{text}</small>}</label>
      <div>
        <button onClick={() => newValue('remove')} type="button" style={(+value - steps) >= min ? undefined : { opacity: 0.5, cursor: 'not-allowed', color: '#ccc' }}><IconMinus /></button>
        <input id={name} type="number" value={value} min={min} max={max} onInput={setValue} />
        <button onClick={() => newValue('add')} type="button" style={(+value + steps) <= max ? undefined : { opacity: 0.5, cursor: 'not-allowed', color: '#ccc' }}><IconPlus /></button>
      </div>
    </div>
  );
};

export default Counter;
