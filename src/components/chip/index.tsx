import { FunctionalComponent, h } from 'preact';

import style from './style.module.css';

interface ChipProps {
    label: string;
    small?: boolean;
    icon?: any;
    type?: 'inactive' | 'active' | 'warning' | 'delete' | 'grey' | 'disabled';
    action: () => void;
}

const Chip: FunctionalComponent<ChipProps> = ({ label, icon, action, small, type = 'inactive' }: ChipProps) => (
  <button
    class={`${style.chip} ${style[type]} ${small ? style.small : ''}`}
    onClick={action}
    aria-label={label}
    type="button"
  >
    {icon}{label}
  </button>
);

export default Chip;
