import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { replaceSpecialCharacters } from '../../../helper/string';
import style from './style.module.css';

interface OptionInputProps {
    icon?: any;
    label?: string;
    name: string;

    options: string[];

    type?: 'text' | 'number' | 'date' | 'time';
    value?: string;
    optionValue?: string;
    placeholder?: string;

    disabled?: boolean;
    required?: true;

    autocomplete?: string;
    error?: 'invalid' | 'error' | 'valid';

    change: (value: any, key: string, option?: string) => void,
}

const OptionInput: FunctionalComponent<OptionInputProps> = ({ label, icon, name, optionValue, options, disabled, type = 'text', error, placeholder, autocomplete, required, value, change }: OptionInputProps) => {
  const [values, setValues] = useState<{
    value?: string,
    option?: string,
  }>({
    option: optionValue,
    value,
  });

  const changeValue = (e: any) => {
    const getValue: any = e.target.value;
    return setValues({ ...values, value: getValue });
  };

  const changeOption = (e: any) => {
    const getValue: any = e.target.id;
    setValues({ ...values, option: getValue });
  };

  useEffect(() => {
    if (values?.value && values.option) change(values?.value, name, values?.option);
  }, [values]);

  return (
    <div class={style.container}>
      <div class={error ? style[error] : ''} title={placeholder}>
        {icon && icon}
        <div>
          {label && <label for={name} class={disabled ? style.disabled : undefined}>{required && '*'}{label}</label>}
          <input id={name} type={type} min={type === 'number' ? 0 : undefined} disabled={disabled} value={value} placeholder={placeholder} autoComplete={autocomplete || 'off'} onInput={changeValue} />
        </div>
        <div class={style.radioBox}>
          {options.map((x: string) => (
            <Fragment>
              <input type="radio" id={replaceSpecialCharacters(x)} name={name} checked={replaceSpecialCharacters(x) === values.option} onInput={changeOption} /><label for={replaceSpecialCharacters(x)}>{x}</label>
            </Fragment>
          ))}
        </div>
      </div>
      {error === 'error' && <small class={style.errorMessage}>Bitte mache eine korrekte eingabe</small>}
    </div>
  );
};

export default OptionInput;
