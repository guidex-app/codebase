import { Fragment, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';

import ErrorMessage from '../errorMessage';
import style from './style.module.css';

interface TextInputProps {
    change: (value: any, key: string) => void,
    label?: string;
    name: string;
    value?: string;

    icon?: any;
    placeholder?: string;

    disabled?: boolean;
    required?: true;

    showError?: boolean;
}

const TextInput: FunctionalComponent<TextInputProps> = ({ label, icon, name, disabled, showError, placeholder, required, value, change }: TextInputProps) => {
  const [state, setState] = useState<{ focus: boolean, error: string | undefined }>({ focus: false, error: undefined });

  const checkFocus = (hasFocus: boolean) => { if (!state.focus && !hasFocus) setState({ ...state, focus: hasFocus }); };

  const newValue = (e: any) => {
    const getValue: any = e.target.value;
    return change(getValue, name);
  };

  return (
    <Fragment>
      <div class={`${style.container} ${disabled ? style.disabled : ''} ${state.error ? style.invalid : style.valid} ${state.focus ? style.hasFocus : ''} ${style.hasValue}`} title={placeholder}>
        {icon && icon}
        <div>
          {label && <label for={name}>{required && '*'}{label}</label>}
          <textarea
            id={name}
            rows={5}
            disabled={disabled}
            value={value}
            placeholder={placeholder}
            onInput={newValue}
            onFocus={() => checkFocus(true)}
            onBlur={() => checkFocus(false)}
          />
        </div>
      </div>
      <ErrorMessage show={!!(showError && state.error)} message={(showError && state.error) || undefined} />
    </Fragment>
  );
};

export default TextInput;
