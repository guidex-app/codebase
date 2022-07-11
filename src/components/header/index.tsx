import { IconX } from '@tabler/icons';
import { FunctionalComponent, h } from 'preact';

import style from './style.module.css';

interface HeaderProps {
    title?: string;
    invert?: true;
    action?: () => void;
}

const Header: FunctionalComponent<HeaderProps> = ({ title, invert, action }: HeaderProps) => (
  <header class={`${style.header} ${invert ? style.invert : ''}`}>
    <div class={style.title}><h1>{title}</h1></div>
    <div class={style.menu}>
      <button onClick={action} type="button" aria-label="Menü">
        <IconX fill="var(--red)" />
      </button>
    </div>
  </header>
);

export default Header;
