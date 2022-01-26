import { FunctionalComponent, h } from 'preact';
import { Calendar, Sun, Navigation } from 'react-feather';

import style from './style.module.css';

interface ChooserProps {
    action: (type: 'Tag' | 'Wetter' | 'Standort' | 'Filtern') => void;
}

const Chooser: FunctionalComponent<ChooserProps> = ({ action }: ChooserProps) => (
  <div class={style.chooser}>
    <button class={style.first} onClick={() => action('Tag')} type="button" aria-label="Tag ändern" tabIndex={0}><Calendar color="#fc424a" size={22} /><small>Tag</small></button>
    <button class={style.second} onClick={() => action('Filtern')} type="button" aria-label="Filter ändern" tabIndex={0}><Sun color="#fc424a" size={22} /><small>Wetter</small></button>
    <button class={style.third} onClick={() => action('Standort')} type="button" aria-label="Ort ändern" tabIndex={0}><Navigation color="#fc424a" size={22} /><small>Ort</small></button>
  </div>
);

export default Chooser;
