import { IconColumns } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import TextHeader from '../../components/iconTextHeader';
import Item from '../../components/item';
import { getFireCollection } from '../../data/fire';

interface ListsProps {
    uid?: string;
}

const Lists: FunctionalComponent<ListsProps> = ({ uid }: ListsProps) => {
  const [lists, setLists] = useState<false | undefined | any[]>([]);

  const loadListData = async () => {
    const listData = await getFireCollection('lists', false, [['uid', '==', uid]]);
    setLists(listData || undefined);
  };

  useEffect(() => {
    if (uid) loadListData();
  }, [uid]);

  // const [showListModal, setShowListModal] = useState<{ open: boolean, list?: any }>({ open: false });
  // const [segment, setSegment] = useState<'all' | 'private' | 'shared' | 'vote'>('all');

  // useEffect(() => {
  //   if (uid && lists.length === 0) loadListsData(uid);
  // }, [uid]);

  // useEffect(() => {
  //   if (allLists.length !== 0) setLists([]);
  // }, [allLists]);

  // const openEditListModal = (list?: any):void => setShowListModal({ open: true, list });

  // const closeEditListModal = (isDeleted: boolean, field?: any):void => {
  //   if (field) {
  //     const newArray: any[] = [...(lists || [])];
  //     const listsElementIndex: number = newArray.findIndex((x) => x.title.form === field.title.form);

  //     if (isDeleted && listsElementIndex !== -1) {
  //       newArray.splice(listsElementIndex, 1);
  //     } else if (listsElementIndex !== -1) {
  //       newArray[listsElementIndex] = { ...field };
  //     } else {
  //       newArray.push({ ...field });
  //     }

  //     setLists(newArray);
  //   }

  //   setShowListModal({ open: false });
  // };
  if (!uid) return <Item label="Bitte logge dich ein" text="Um die Listen zu nutzen musst du dich einloggen." />;

  return (
    <Fragment>
      <TextHeader icon={<IconColumns />} title="Listen" text="Deine gespeicherten Listen" />

      {lists && lists?.map((x: any) => (
        <Item label={x.title.form} />
      ))}
    </Fragment>
  );
};

export default Lists;
