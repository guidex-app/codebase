import { IconCalendar, IconLiveView, IconSun } from '@tabler/icons';
import { FunctionalComponent, h } from 'preact';

import style from './style.module.css';

interface ChooserProps {
    action: (type: 'Tag' | 'Wetter' | 'Standort' | 'Filtern') => void;
}

const Chooser: FunctionalComponent<ChooserProps> = ({ action }: ChooserProps) => (
  <div class={style.chooser}>
    <button class={style.first} onClick={() => action('Tag')} type="button" aria-label="Tag ändern" tabIndex={0}><IconCalendar color="#581e0d" size={22} /><small>Tag</small></button>
    <button class={style.second} onClick={() => action('Filtern')} type="button" aria-label="Filter ändern" tabIndex={0}><IconSun color="#581e0d" fill="#581e0d" size={22} /><small>Wetter</small></button>
    <button class={style.third} onClick={() => action('Standort')} type="button" aria-label="Ort ändern" tabIndex={0}><IconLiveView color="#581e0d" size={22} /><small>Ort</small></button>
  </div>
);

export default Chooser;
