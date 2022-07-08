import { IconHeart } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';

import TextHeader from '../../components/iconTextHeader';
import Item from '../../components/item';
import Loading from '../../components/masonry/loading';
import MessageButton from '../../components/messageButton';
import Modal from '../../container/modal';
import { getFireCollection } from '../../data/fire';
import CreateList from './createList';
import ListItem from './listItem/listItem';
import style from './style.module.css';

interface ListsProps {
    uid?: string;
}

const Lists: FunctionalComponent<ListsProps> = ({ uid }: ListsProps) => {
  const [lists, setLists] = useState<false | undefined | any[]>(false);
  const [openCreateList, setOpenCreateList] = useState(false);

  const loadListData = async () => {
    if (!uid) setLists(undefined);
    const listData = await getFireCollection('lists', false, [['uid', '==', uid]]);
    setLists(listData);
  };

  const addNew = () => {
    if (!uid) route('/login');
    setOpenCreateList(true);
  };

  const closeModal = async (newDoc?: any) => {
    setOpenCreateList(false);

    if (!newDoc?.title?.form) return;

    const index: number = lists ? lists.findIndex((d) => d.title === newDoc.title) : -1;
    if (!lists) {
      setLists([newDoc]);
    } else if (lists && index === -1) {
      setLists([...lists, newDoc]);
    } else {
      const newList = lists.splice(index, 1, newDoc);
      setLists(newList);
    }
  };

  useEffect(() => { loadListData(); }, [uid]);

  return (
    <Fragment>
      <TextHeader icon={<IconHeart />} title="Deine Erlebnisse" text="Es gibt Erlebnisse, die du festhalten willst, dann kreiere eine Sammlung und teile sie mit Freunden." />

      <main style={{ padding: '20px 10px' }} class="size_holder">
        {uid && lists ? (
          <Fragment>
            <Item label="Liste anlegen" action={addNew} type="grey" />
            <div class={style.list}>
              {lists && lists.map((x: any) => (
                <ListItem item={x} />
              ))}
            </div>
          </Fragment>
        ) : (
          <Fragment>
            {lists === false ? <Loading /> : (
              <MessageButton
                title="Es wurde noch nichts angelegt"
                text="Lege deine erste Sammlung an, um durchzustarten"
                buttonText="Neue Sammlung anlegen"
                action={addNew}
              />
            )}

            ...
          </Fragment>
        )}
      </main>

      {openCreateList && (
      <Modal title="Neue Sammlung anlegen" close={closeModal}>
        <CreateList close={closeModal} uid={uid} />
      </Modal>
      )}
    </Fragment>
  );
};

export default Lists;
