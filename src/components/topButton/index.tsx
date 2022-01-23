import { FunctionalComponent, h } from 'preact';
import style from './style.module.css';

interface TopButtonProps {
    title?: string;
    action: () => void;
}

const TopButton: FunctionalComponent<TopButtonProps> = ({ action, title = 'Zurück' }: TopButtonProps) => (
  <button type="button" class={style.topButton} onClick={action}>
    {title}
  </button>

);

export default TopButton;
