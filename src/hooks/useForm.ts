import { useEffect, useReducer, useState } from 'preact/hooks';

import { isEmail, isPhone, isPlz, isURL } from '../helper/formCheck';
import { FormInit, FormType } from '../interfaces/form';

const useForm = (init: FormInit): {
  fields: { [key: string]: any },
  formState: { [key: string]: 'invalid' | 'error' | 'valid' },
  changeField: (value: any, key: string, indexNr?: number) => void,
  isLoading: boolean,
  isValid: () => boolean,
} => {
  const [isLoading, setIsLoading] = useState(false);
  const [fields, setFields] = useReducer((state: any, newState: any) => ({ ...state, ...newState }), {});
  const [formState, setFormState] = useReducer((state: any, newState: any) => ({ ...state, ...newState }), {});

  const getState = (fieldType: FormType, value?: any): 'valid' | 'invalid' => {
    switch (fieldType) {
      case 'phone': { if (isPhone(value)) return 'valid'; break; }
      case 'title': { if (value?.form && value?.name) return 'valid'; break; }
      case 'image': { if (value > 0) return 'valid'; break; }
      case 'email': { if (isEmail(value)) return 'valid'; break; }
      case 'plz': { if (isPlz(value)) return 'valid'; break; }
      case 'geo': { if (value.geohash && value.geopoint) return 'valid'; break; }
      case 'password': { if (typeof value === 'string' && value.length > 6) return 'valid'; break; }
      case 'string': { if (typeof value === 'string' && value && value.length > 3) return 'valid'; break; }
      case 'string[]': { if (value && value.length > 0) return 'valid'; break; }
      case 'website': { if (isURL(value)) return 'valid'; break; }
      case 'range[]': { if (value && value.length > 0 && value.every((x: string | false) => x === false || (x && !x.startsWith('-') && !x.endsWith('-')))) return 'valid'; break; }
      default: { if (typeof value === fieldType) return 'valid'; break; }
    }
    return 'invalid';
  };

  const setUpInitialValue = (): void => {
    const vals: { [key: string]: any } = {};
    const state: { [key: string]: 'invalid' | 'valid' } = {};

    Object.entries(init).forEach(([key, val]) => {
      vals[key] = val.value;
      state[key] = getState(val.type, val.value);
      return true;
    });

    setFormState({ ...state });
    setFields({ ...vals });
  };

  useEffect(() => {
    setUpInitialValue();
  }, []);

  const changeArray = (value: any, key: string, indexNr: number) => {
    const oldArray: string[] = fields[key] || [];
    if (init[key].type === 'string') {
      setFields({ [key]: value });
    } else if (indexNr !== undefined && indexNr !== -1) {
      console.log('hier', value);
      if (value !== undefined && value !== oldArray[indexNr]) oldArray.splice(indexNr, 1, value);
      else oldArray.splice(indexNr, 1);
      setFields({ [key]: [...oldArray] });
    } else {
      setFields({ [key]: [...oldArray, value] });
    }
  };

  const changeField = (value: any, key: string, indexNr?: number) => {
    if (indexNr !== undefined) {
      changeArray(value, key, indexNr);
    } else {
      setFields({ [key]: value });
    }

    setFormState({ [key]: getState(init[key].type, value) });
  };

  const isValid = (): boolean => {
    let valid = true;
    const invalid: { [key: string]: 'error' } = {};

    Object.keys(init).forEach((key: string) => {
      if (init[key].required && (!formState[key] || formState[key] !== 'valid')) {
        valid = false;
        invalid[key] = 'error';
      }
    });

    console.log('validation', invalid);
    if (!valid) setFormState({ ...invalid });
    else setIsLoading(true);
    return valid;
  };

  return { fields, formState, changeField, isValid, isLoading };
};

export default useForm;
