/* eslint-disable jsx-a11y/control-has-associated-label */
import { FunctionalComponent, h } from 'preact';
import { Minus, Plus } from 'react-feather';

import style from './style.module.css';

interface CounterProps {
    label: string;
    name: string;
    value?: number;
    min?: number;
    max?: number;
    steps?: number;
    type?: 'small' | 'large';
    change: (value: any, key: string) => void,
}

const Counter: FunctionalComponent<CounterProps> = ({ label, name, min = 1, type = 'small', max = 10000, value = 0, steps = 1, change }: CounterProps) => {
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
    <div class={`${style.counter} ${style[type]}`}>
      <label for={name}>{label}</label>
      <div>
        <button onClick={() => newValue('remove')} type="button" style={(+value - steps) >= min ? undefined : { opacity: 0.5, color: '#ccc' }}><Minus /></button>
        <input id={name} type="number" value={value} min={min} max={max} onInput={setValue} />
        <button onClick={() => newValue('add')} type="button" style={(+value + steps) <= max ? undefined : { opacity: 0.5, color: '#ccc' }}><Plus /></button>
      </div>
    </div>
  );
};

export default Counter;
