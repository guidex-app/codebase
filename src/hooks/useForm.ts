import { useEffect, useReducer, useState } from 'preact/hooks';

const useForm = (data?: { [key: string]: any }, required?: string[]): {
  form: { [key: string]: any },
  changeForm: (value: any, key: string, complete?: true) => void,
  isValid: boolean,
} => {
  const [form, setForm] = useReducer((state: any, newState: any) => ({ ...state, ...newState }), data);
  const [isValid, setIsValid] = useState<boolean>(false);

  const validate = () => {
    if (!required) return setIsValid(true);
    const checkFields: boolean = !!required?.some((key: string) => !form?.[key]);
    return setIsValid(checkFields);
  };

  const changeForm = (value: any, key: string) => {
    setForm({ [key]: value });
    if (required?.includes(key) && ((!value && form?.[key]) || (value && !form?.[key]))) validate();
    console.log({ ...form, [key]: value });
  };

  useEffect(() => { validate(); }, []); // init

  return { form, changeForm, isValid };
};

export default useForm;
