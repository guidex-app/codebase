import { IconFolderPlus, IconLogin } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import MessageButton from '../../../components/infos/messageButton';
import Item from '../../../components/item';
import Spinner from '../../../components/spinner';
import { getFireCollection } from '../../../data/fire';
import { addCatToList } from '../../../data/listFire';
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

  const addNewCat = async (listItem: List) => {
    if (!listItem.title?.form || !uid || !cat.form) return;
    await addCatToList(listItem, cat);
    close();
  };

  useEffect(() => { loadListData(); }, []);
  const colorMap: { [key: string]: string } = { Rot: '#e35e7f', Grün: '#34c359', Gelb: '#f8ff15', Orange: '#ffab02', Lila: '#ea3ffc', Blau: '#8c7eff' };

  return (
    <Fragment>
      {!uid && (
        <Item
          icon={<IconLogin />}
          link="/login"
          label="Einloggen, um teilzunehmen"
        />
      )}

      {lists === false && uid && <Spinner />}

      {uid && lists && (
        lists.map((x: List) => (
          <Item icon={<IconFolderPlus color={colorMap[x.color]} />} label={x.title.name} text={x.type} action={() => addNewCat(x)} editLabel="Hinzufügen" />
        ))
      )}

      {uid && lists === undefined && (
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
