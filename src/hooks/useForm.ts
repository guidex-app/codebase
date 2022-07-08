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
    const checkFields: boolean = required?.every((key: string) => {
      console.log(form?.[key]);
      return !!form?.[key];
    });

    console.log(checkFields ? 'valid' : 'invalid', form);
    return setIsValid(checkFields);
  };

  const changeForm = (value: any, key: string) => {
    setForm({ [key]: value });
  };

  useEffect(() => { validate(); }, [form]);

  return { form, changeForm, isValid };
};

export default useForm;
