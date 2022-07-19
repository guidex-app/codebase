import { FunctionalComponent, h } from 'preact';

import style from './style.module.css';

interface AddRemoveProps {
    action: (type: 'add' | 'remove', name: string) => void;
     isFirst: boolean;
     name: string;
}

const AddRemove: FunctionalComponent<AddRemoveProps> = ({ action, isFirst, name }: AddRemoveProps) => (
  <div class={style.addRemove}>
    <button type="button" onClick={() => action('add', name)}>Feld hinzufügen</button>
    {!isFirst && <button type="button" onClick={() => action('remove', name)}>Feld löschen</button>}
  </div>
);

export default AddRemove;
