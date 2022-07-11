import { Fragment, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';

import ErrorMessage from '../errorMessage';
import style from './style.module.css';

interface MultiInputProps {
    change: (value: any, key: string) => void,
    label?: string;
    name: string;
    value?: string;

    type?: 'number' | 'time' | 'string';

    icon?: any;
    group?: true;
    autocomplete?: string;
    placeholder?: string;

    disabled?: boolean;
    required?: true;

    showError?: boolean;
}

const MultiInput: FunctionalComponent<MultiInputProps> = ({ label, group, icon, name, disabled, type = 'number', showError, placeholder, autocomplete, required, value, change }: MultiInputProps) => {
  const checkError = (newValue: string): string | undefined => {
    if (newValue.startsWith('-') || newValue.endsWith('-')) return 'Bitte mind. 2 Werte angeben';

    const [first, second] = newValue.split('-') || ['', ''];
    switch (type) {
      case 'time': { if (second <= first) return 'Bitte gebe eine gültige Zeitspanne an'; break; }
      case 'number': { if (+second <= +first) return 'Bitte gebe einen gültigen von/bis Wert an'; break; }
      default: { return undefined; }
    }
  };

  const [invalidValue, setInvalidValue] = useState<string | undefined>(value);
  const [state, setState] = useState<{ focus: boolean, error: string | undefined }>({ focus: false, error: checkError(value || '') });
  const checkFocus = (hasFocus: boolean) => { if (!state.focus && !hasFocus) setState({ ...state, focus: hasFocus }); };

  const changeValue = (e: any) => {
    const getValue: any = e.target.value;

    const isSecond: boolean = e.target.id.endsWith('+second');

    const [first, second]: string[] = invalidValue ? invalidValue.split('-') : ['', ''];

    const multiValue = isSecond ? `${first || ''}-${getValue === '00:00' ? '24:00' : getValue}` : `${getValue === '24:00' ? '00:00' : getValue}-${second || ''}`;
    setInvalidValue(multiValue);

    const error: string | undefined = checkError(multiValue);
    change(error ? undefined : multiValue, name);

    console.log(multiValue);

    if (error !== state.error) setState({ ...state, error });
  };

  return (
    <Fragment>
      <div class={`${style.container} ${disabled ? style.disabled : ''} ${state.error ? style.invalid : style.valid} ${state.focus ? style.hasFocus : ''} ${style.hasValue} ${group ? style.group : ''}`} title={placeholder}>
        {icon && icon}
        <div class={style.multi}>
          {label && <label for={name}>{required && '*'}{label}</label>}

          <input id={name} type={type} min={type === 'number' ? 0 : undefined} disabled={disabled} value={invalidValue?.split('-')?.[0] || ''} placeholder={placeholder?.split(' / ')?.[0] || ''} autoComplete={autocomplete || 'off'} onInput={changeValue} onFocus={() => checkFocus(true)} onBlur={() => checkFocus(false)} />
          <input id={`${name}+second`} type={type} min={type === 'number' ? 0 : undefined} disabled={disabled} value={invalidValue?.split('-')?.[1] || ''} placeholder={placeholder?.split(' / ')?.[1] || ''} autoComplete={autocomplete || 'off'} onInput={changeValue} />

        </div>
      </div>
      <ErrorMessage show={!!(showError && state.error)} message={(showError && state.error) || undefined} />
    </Fragment>
  );
};

export default MultiInput;
