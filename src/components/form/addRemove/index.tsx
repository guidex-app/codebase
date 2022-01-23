import { FunctionalComponent, h } from 'preact';
import Chip from '../../chip';

interface AddRemoveProps {
    action: (type: 'add' | 'remove', name: string) => void;
     isFirst: boolean;
     name: string;
}

const AddRemove: FunctionalComponent<AddRemoveProps> = ({ action, isFirst, name }: AddRemoveProps) => (
  <div style={{ textAlign: 'center' }}>
    <Chip label="Feld hinzufügen" action={() => action('add', name)} type="active" small />
    {!isFirst && <Chip label="Feld löschen" action={() => action('remove', name)} small />}
  </div>
);

export default AddRemove;
