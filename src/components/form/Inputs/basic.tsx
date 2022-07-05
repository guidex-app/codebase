import { Fragment, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';

import { isEmail, isPhone, isPlz, isStreetWithNr, isURL, noSpecialCharacters } from '../../../helper/formCheck';
import ErrorMessage from '../errorMessage';
import style from './style.module.css';

interface NormalInputProps {
    change: (value: any, key: string) => void,
    label: string;
    name: string;
    value?: string;

    type?: 'string' | 'street' | 'number' | 'phone' | 'date' | 'time' | 'email' | 'plz' | 'password' | 'url';

    icon?: any;
    group?: true;
    autocomplete?: string;
    placeholder?: string;

    disabled?: boolean;
    required?: true;

    showError?: boolean;
}

const NormalInput: FunctionalComponent<NormalInputProps> = ({ label, group, icon, name, disabled, type = 'string', showError, placeholder, autocomplete = 'off', required, value, change }: NormalInputProps) => {
  const checkError = (newValue: string | number): string | undefined => {
    switch (type) {
      case 'string': { if (!noSpecialCharacters(newValue.toString()) || newValue.toString().length < 3) return 'Bitte gebe eine gültige Antwort an'; break; }
      case 'number': { if (typeof newValue !== 'number') return 'Bitte gebe eine gültige nummer an'; break; }
      case 'date': { if (!newValue) return 'Bitte gebe ein korrektes Datum an'; break; }
      case 'time': { if (!newValue) return 'Bitte gebe ein korrekte Zeit an'; break; }
      case 'street': { if (!isStreetWithNr(newValue.toString())) return 'Bitte gebe eine Straße mit einer Hausnummer an'; break; }
      case 'phone': { if (!isPhone(newValue.toString())) return 'Bitte gebe eine gültige Telefonnummer an'; break; }
      case 'email': { if (!isEmail(newValue.toString())) return 'Bitte gebe eine gültige E-Mail an'; break; }
      case 'plz': { if (!isPlz(+newValue)) return 'Bitte gebe eine gültige Postleitzahl an'; break; }
      case 'password': { if (newValue.toString().length < 6) return 'Bitte gebe eine gültiges Passwort, mit min. 6 Zeichen an'; break; }
      case 'url': { if (!isURL(newValue.toString())) return 'Bitte gebe eine gültige URL an'; break; }

      default: { return undefined; }
    }
  };

  const [invalidValue, setInvalidValue] = useState<string | number | undefined>(value);
  const [state, setState] = useState<{ focus: boolean, error: string | undefined }>({ focus: false, error: checkError(value || '') });

  const checkFocus = (hasFocus: boolean) => { setState({ ...state, focus: hasFocus }); };

  const changeValue = (e: any) => {
    const getValue: string | number = e.target.value;
    setInvalidValue(getValue);

    const error: string | undefined = checkError(getValue || '');
    change(error ? undefined : getValue, name);

    if (error !== state.error) setState({ ...state, error });
  };

  return (
    <Fragment>
      <div class={`${style.container} ${disabled ? style.disabled : ''} ${state.error ? style.invalid : style.valid} ${state.focus ? style.hasFocus : ''} ${invalidValue || ['date', 'time'].includes(type) ? style.hasValue : ''} ${group ? style.group : ''}`} title={placeholder}>
        {icon && icon}
        <div>
          <label for={name}>{`${required ? '*' : ''}${label}`}</label>
          <input
            id={name}
            type={type}
            min={type === 'number' ? 0 : undefined}
            disabled={disabled}
            value={invalidValue}
            placeholder={placeholder}
            autoComplete={autocomplete}
            onInput={changeValue}
            onFocus={() => checkFocus(true)}
            onBlur={() => checkFocus(false)}
          />
        </div>
      </div>
      <ErrorMessage show={!!(showError && state.error)} message={(showError && state.error) || undefined} />
    </Fragment>
  );
};

export default NormalInput;
