import { Fragment, FunctionalComponent, h } from 'preact';

import style from './style.module.css';

interface BasicInputProps {
    change: (value: any, key: string) => void,
    label?: string;
    name: string;
    value?: string;

    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'textarea' | 'time';

    icon?: any;
    autocomplete?: string;
    placeholder?: string;

    disabled?: boolean;
    required?: true;
    isMulti?: boolean;

    error?: 'invalid' | 'error' | 'valid';
}

const BasicInput: FunctionalComponent<BasicInputProps> = ({ label, isMulti, icon, name, disabled, type = 'text', error, placeholder, autocomplete, required, value, change }: BasicInputProps) => {
  const newValue = (e: any) => {
    const getValue: any = e.target.value;
    if (!isMulti) return change(getValue, name);

    const isSecond: boolean = e.target.id.endsWith('+second');

    const [first, second]: string[] = value ? value.split('-') : ['', ''];
    const multiValue = isSecond ? `${first}-${getValue}` : `${getValue}-${second}`;
    return change(multiValue, name);
  };

  return (
    <div class={style.container}>
      <div class={error ? style[error] : ''} title={placeholder}>
        {icon && icon}
        <div class={isMulti ? style.multi : ''}>
          {label && <label for={name} class={disabled ? style.disabled : undefined}>{required && '*'}{label}</label>}
          {type !== 'textarea' ? (
            <Fragment>
              <input id={name} type={type} min={type === 'number' ? 0 : undefined} disabled={disabled} value={isMulti && value ? value?.split('-')?.[0] : value} placeholder={isMulti ? placeholder?.split(' / ')?.[0] : placeholder} autoComplete={autocomplete || 'off'} onInput={newValue} />
              {isMulti && <input id={`${name}+second`} type={type} min={type === 'number' ? 0 : undefined} disabled={disabled} value={(value && value?.split('-')?.[1])} placeholder={isMulti ? placeholder?.split(' / ')?.[1] : placeholder} autoComplete={autocomplete || 'off'} onInput={newValue} />}
            </Fragment>
          ) : (
            <textarea id={name} rows={5} disabled={disabled} value={value} placeholder={placeholder} onInput={newValue} />
          )}
        </div>
      </div>
      {error === 'error' && <small class={style.errorMessage}>Bitte mache eine korrekte eingabe</small>}
    </div>
  );
};

export default BasicInput;
