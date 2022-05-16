import { IconCalendar, IconLocation, IconSun } from '@tabler/icons';
import { FunctionalComponent, h } from 'preact';

import style from './style.module.css';

interface InfoListProps {
    action: (type: 'Tag' | 'Wetter' | 'Standort' | 'Filtern') => void;
}

const InfoList: FunctionalComponent<InfoListProps> = ({ action }: InfoListProps) => (
  <div class={style.InfoList}>
    <button class={style.first} onClick={() => action('Tag')} type="button" aria-label="Tag ändern" tabIndex={0}><IconCalendar color="var(--red)" size={22} /><small>Tag</small></button>
    <button class={style.second} onClick={() => action('Filtern')} type="button" aria-label="Filter ändern" tabIndex={0}><IconSun color="var(--red)" size={22} /><small>Wetter</small></button>
    <button class={style.third} onClick={() => action('Standort')} type="button" aria-label="Ort ändern" tabIndex={0}><IconLocation color="var(--red)" size={22} /><small>Ort</small></button>
  </div>
);

export default InfoList;
