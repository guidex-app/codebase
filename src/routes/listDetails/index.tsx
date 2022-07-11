import { IconHeart, IconInfoCircle, IconLogin } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import BackButton from '../../components/backButton';
import FilterList from '../../components/filter';
import TextHeader from '../../components/infos/iconTextHeader';
import Item from '../../components/item';
import BasicMasonry from '../../components/masonry/basicMasonry';
import Modal from '../../container/modal';
import activityFilter from '../../data/activityFilter';
import { getFireCollection, getFireDocument } from '../../data/fire';
import { Cat } from '../../interfaces/categorie';
import VotingView from './votingView';

interface ActivitiesProps {
    listID: string;
    uid?: string;
}

const ListDetails: FunctionalComponent<ActivitiesProps> = ({ listID, uid }: ActivitiesProps) => {
  const [list, setList] = useState<any | undefined>();
  const [cats, setCats] = useState<Cat[] | undefined | false>(false);
  const [filter, setFilter] = useState<string[]>([]);
  const [openModal, setOpenModal] = useState<'Filtern' | 'addToList' | false>(false);

  const getCategories = async () => {
    if (listID) {
      const listData = await getFireCollection(`lists/${listID}_${uid}/cats`, false);
      setCats(listData);
    }
  };

  const updateFilter = (newFilter: string[]) => { setFilter(newFilter); };

  const getList = async () => {
    if (!listID) return;

    const data = await getFireDocument(`lists/${listID}_${uid}`);
    if (data?.title?.form) {
      setList(data);
      getCategories();
    }
  };

  const closeModal = () => setOpenModal(false);

  useEffect(() => { getList(); }, [listID]);

  return (
    <Fragment>
      <BackButton url="/lists" title="Zurück" />

      <TextHeader
        icon={<IconHeart />}
        title={`${list?.title?.name || ''} ${list?.type ? `(${list.type})` : ''}`}
        text={list?.description || 'Es gibt Erlebnisse, die du festhalten willst, dann kreiere eine Sammlung und teile sie mit Freunden.'}
      />

      {list?.title?.form && list.type === 'Voting' && (
        <div className="small_size_holder">
          <VotingView listId={`${list.title.form}_${list.uid}`} />

            {!uid && (
              <Item
                icon={<IconLogin />}
                link="/login"
                label="Einloggen, um teilzunehmen"
              />
            )}
        </div>
      )}

      {cats === undefined && <Item icon={<IconInfoCircle />} type="info" label="Es wurde nichts in deiner Nähe gefunden" text="Überprüfe deinen Standort oder wähle eine andere Aktivität" />}

      <BasicMasonry list={cats} />

      {!!openModal && (
      <Modal title={openModal} close={closeModal}>
        {openModal === 'Filtern' && <FilterList data={activityFilter} values={filter} change={updateFilter} close={closeModal} />}
      </Modal>
      )}
    </Fragment>
  );
};

export default ListDetails;
