import { FunctionalComponent, h } from 'preact';
import { Calendar, Sun, Navigation } from 'react-feather';

import style from './style.module.css';

interface ChooserProps {
    action: (type: 'Tag' | 'Wetter' | 'Standort' | 'Filtern') => void;
}

const Chooser: FunctionalComponent<ChooserProps> = ({ action }: ChooserProps) => (
  <div class={style.chooser}>
    <div class={style.first} onClick={() => action('Tag')} role="button" aria-label="Tag ändern" tabIndex={0}><Calendar color="#fc424a" size={22} /></div>
    <div class={style.second} onClick={() => action('Filtern')} role="button" aria-label="Filter ändern" tabIndex={0}><Sun color="#fc424a" size={22} /></div>
    <div class={style.third} onClick={() => action('Standort')} role="button" aria-label="Ort ändern" tabIndex={0}><Navigation color="#fc424a" size={22} /></div>
  </div>
);

export default Chooser;
