import { FunctionalComponent, h } from 'preact';
import style from './style.module.css';

interface HeaderProps {
    action?: () => void;
}

const Overlay: FunctionalComponent<HeaderProps> = ({ action }: HeaderProps) => (
  <div class={style.overlay} onClick={action} role="presentation" />
);

export default Overlay;
