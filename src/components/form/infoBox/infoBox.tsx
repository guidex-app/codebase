import { FunctionalComponent, h } from 'preact';
import { MessageCircle } from 'react-feather';

import style from './style.module.css';

interface InfoBoxProps {
  title?: string;
  text?: string;
}

const InfoBox: FunctionalComponent<InfoBoxProps> = ({ title, text }: InfoBoxProps) => (
  <div class={style.box}>
    <MessageCircle color="var(--fifth)" />
    {title && <p>{title}</p>}
    {text && <p style={{ color: 'var(--fifth)' }}>{text}</p>}
  </div>
);

export default InfoBox;
