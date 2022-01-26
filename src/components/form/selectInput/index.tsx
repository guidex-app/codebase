import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import Modal from '../../../container/modal';
import CheckInput from '../checkInput';

import style from './style.module.css';

interface SelectInputProps {
    label: string;
    name: string;
    options: string[];
    value?: string;
    disabled?: boolean;
    icon?: any;
    error?: 'invalid' | 'error' | 'valid';
    required?: true;
    change: (value: any, key: string) => void,
}

const SelectInput: FunctionalComponent<SelectInputProps> = ({ label, name, icon, disabled, options, error, required, value, change }: SelectInputProps) => {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [list, setList] = useState<string[]>(options);

  const select = (val: boolean, itemName: string) => {
    if (val) {
      change(itemName, name);
      setOpen(false);
    }
  };

  useEffect(() => {
    if (searchText) {
      const newSearchedItems: string[] = options.filter((s: string) => s.toLowerCase().indexOf(searchText.toLowerCase()) > -1);
      setList(newSearchedItems);
    }
  }, [searchText]);

  return (
    <div class={style.container}>
      <div class={error !== 'valid' && required ? style.error : 'valid'}>
        {icon && icon}
        <div>
          <label for={name} class={disabled ? style.disabled : undefined}>{required && '*'}{label}</label>
          <button type="button" onClick={() => setOpen(true)} aria-label="Auswählen">{value}</button>
        </div>
      </div>
      {error === 'error' && <small class={style.errorMessage}>Bitte mache eine korrekte eingabe</small>}

      {open && (
      <Modal title="Auswählen" close={() => setOpen(false)}>
        {options.length > 5 && <input class={style.search} type="text" disabled={disabled} value={searchText} placeholder="Liste durchsuchen" autoComplete="off" onInput={(e: any) => setSearchText(e.target.value)} />}
          {(searchText ? list : options).map((x) => <CheckInput key={x} value={undefined} name={x} label={x} list change={select} />)}
      </Modal>
      )}
    </div>
  );
};

export default SelectInput;
