import { FunctionalComponent, h } from 'preact';

import style from './style.module.css';

interface ChipProps {
    label: string;
    icon?: any;
    size?: 'large' | 'medium' | 'small'
    type?: 'inactive' | 'active' | 'warning' | 'delete' | 'grey' | 'disabled';
    action: () => void;
}

const Chip: FunctionalComponent<ChipProps> = ({ label, icon, action, size = 'small', type = 'inactive' }: ChipProps) => (
  <button
    class={`${style.chip} ${style[type]} ${style[size]}`}
    onClick={action}
    aria-label={label}
    type="button"
  >
    {icon}{label}
  </button>
);

export default Chip;
