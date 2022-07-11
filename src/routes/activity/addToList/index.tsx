import { IconFolderPlus } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import MessageButton from '../../../components/infos/messageButton';
import Item from '../../../components/item';
import Spinner from '../../../components/spinner';
import { fireDocument, getFireCollection } from '../../../data/fire';
import { List } from '../../../interfaces/list';

interface AddToListProps {
  cat: { name: string, form: string };
  uid?: string;
  close: () => void;
}

const AddToList: FunctionalComponent<AddToListProps> = ({ cat, uid, close }: AddToListProps) => {
  const [lists, setLists] = useState<List[] | undefined | false>(false);

  const loadListData = async () => {
    if (!uid) setLists(undefined);
    const listData = await getFireCollection('lists', false, [['uid', '==', uid]]);
    setLists(listData);
  };

  const addCatToList = (listId: string) => {
    if (!listId || !uid || !cat.form) return;
    const listFields = { title: cat, vote: 0 };
    fireDocument(`lists/${listId}_${uid}/cats/${cat.form}`, listFields, 'set').then((success: boolean) => {
      if (success) close();
    });
  };

  useEffect(() => { loadListData(); }, []);
  const colorMap: { [key: string]: string } = { Rot: '#7c3747', Grün: '#34c359', Gelb: '#e7b442', Orange: '#e97537', Lila: '#632969', Blau: '#2c2567' };

  if (lists === false) return <Spinner />;

  return (
    <Fragment>
      <h2>Füge {cat.name} einer Liste hinzu</h2><br /><br />
      {uid && lists ? (
        lists.map((x: List) => (
          <Item icon={<IconFolderPlus color={colorMap[x.color]} />} label={x.title.name} text={x.type} action={() => addCatToList(x.title.form)} editLabel="Hinzufügen" />
        ))
      ) : (
        <MessageButton
          title="Es wurde noch nichts angelegt"
          text="Lege deine erste Sammlung an, um durchzustarten"
          buttonText="Neue Sammlung anlegen"
          link="/lists"
        />

      )}
    </Fragment>
  );
};

export default AddToList;
