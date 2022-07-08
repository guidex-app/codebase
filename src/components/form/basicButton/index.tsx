import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';

import Spinner from '../../spinner';
import style from './style.module.css';

interface FormButtonProps {
  isLoading?: boolean;
  disabled?: boolean;
  label?: string;
  type?: 'outline' | 'solid';
  action?: () => void;
}

const FormButton: FunctionalComponent<FormButtonProps> = ({ isLoading = false, action, label = 'Speichern', type = 'solid', disabled }: FormButtonProps) => {
  const [clicked, setClicked] = useState(false);

  const clickFunction = () => {
    setClicked(true);
    if (action) action();

    setTimeout(() => {
      setClicked(false);
    }, 600);
  };

  return (
    <button class={`${type && type === 'outline' ? style.outline : style.solid} mini_size_holder ${clicked ? style.clicked : ''}`} disabled={disabled} type="button" aria-label={label} onClick={clickFunction}>
      {isLoading || clicked ? <Spinner gap={0} /> : label}
    </button>
  );
};

export default FormButton;
