type ArrayFormType = 'string[]' | 'range[]';
export type FormType = 'range' | 'date' | 'string' | 'number' | 'image' | 'email' | 'boolean' | 'plz' | 'password' | 'phone' | 'website' | 'geo' | ArrayFormType;

export type FormInit = { [key: string]: { value?: any, type: FormType, required: boolean } };
