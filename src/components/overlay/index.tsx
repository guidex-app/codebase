import { FunctionalComponent, h } from 'preact';

import style from './style.module.css';

interface HeaderProps {
    action?: () => void;
    isPopup?: true;
}

const Overlay: FunctionalComponent<HeaderProps> = ({ action, isPopup }: HeaderProps) => (
  <div class={style.overlay} style={isPopup ? { zIndex: 71 } : undefined} onClick={action} role="presentation" />
);

export default Overlay;
