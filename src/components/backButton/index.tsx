import { FunctionalComponent, h } from 'preact';
import { Link } from 'preact-router';

import style from './style.module.css';

interface FabButtonProps {
    url: string;
    title?: string;
}

const BackButton: FunctionalComponent<FabButtonProps> = ({ url, title = 'Zurück' }: FabButtonProps) => (
  <Link class={style.backButton} href={url}>
    <span>{title}</span>
  </Link>

);

export default BackButton;
