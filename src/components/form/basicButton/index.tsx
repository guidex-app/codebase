import { FunctionalComponent, h } from 'preact';

import style from './style.module.css';

interface FormButtonProps {
  isLoading?: boolean;
  disabled?: boolean;
  label?: string;
  type?: 'outline' | 'solid';
  action?: () => void;
}

const FormButton: FunctionalComponent<FormButtonProps> = ({ isLoading = false, action, label = 'Speichern', type = 'solid', disabled }: FormButtonProps) => (
  <button class={`${type && type === 'outline' ? style.outline : style.solid} small_size_holder`} disabled={disabled} type="button" aria-label={label} onClick={action}>
    {isLoading ? 'lädt' : label}
  </button>
);

export default FormButton;
