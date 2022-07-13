import { FunctionalComponent, h } from 'preact';

import style from './style.module.css';

interface TopButtonProps {
    title?: string;
    color?: 'white';
    action: () => void;
}

const TopButton: FunctionalComponent<TopButtonProps> = ({ action, color, title = 'Zurück' }: TopButtonProps) => (
  <button type="button" class={style.topButton} style={color ? { color } : undefined} onClick={action}>
    {title}
  </button>

);

export default TopButton;
