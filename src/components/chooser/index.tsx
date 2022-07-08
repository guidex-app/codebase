import { IconCalendar, IconLiveView, IconSun } from '@tabler/icons';
import { FunctionalComponent, h } from 'preact';

import style from './style.module.css';

interface ChooserProps {
    action: (type: 'Tag' | 'Wetter' | 'Standort' | 'Filter') => void;
    city: string;
    day?: 'Heute' | 'Morgen' | string;
}

const Chooser: FunctionalComponent<ChooserProps> = ({ action, day, city }: ChooserProps) => (
  <div class={style.chooser}>
    <button class={style.first} onClick={() => action('Tag')} type="button" aria-label="Heute" tabIndex={0}><IconCalendar color="#581e0d" size={22} /><small>{day}</small></button>
    <button class={style.second} onClick={() => action('Filter')} type="button" aria-label="Sonnig" tabIndex={0}><IconSun color="#581e0d" fill="#581e0d" size={22} /><small>Wetter</small></button>
    <button class={style.third} onClick={() => action('Standort')} type="button" aria-label="Hamburg" tabIndex={0}><IconLiveView color="#581e0d" size={22} /><small>{city}</small></button>
  </div>
);

export default Chooser;
