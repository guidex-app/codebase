import { FunctionalComponent, h } from 'preact';

import style from './style.module.css';

interface CheckInputProps {
    label: string;
    name: string;
    value?: boolean;
    disabled?: boolean;
    required?: true;
    list?: true;
    change: (value: boolean, name: string) => void,
}

const CheckInput: FunctionalComponent<CheckInputProps> = ({ label, name, disabled, required, list, value, change }: CheckInputProps) => (
  <div class={`${style.checkbox} ${list ? style.list : ''}`} onClick={() => !disabled && change(!value, name)} role="button" tabIndex={0}>
    <input type="checkbox" id={name} name={name} checked={!!value} />
    <span />
    <label for={name}>{required && '*'}{label}</label>
  </div>
);

export default CheckInput;
