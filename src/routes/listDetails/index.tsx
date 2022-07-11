import { IconAdjustmentsHorizontal, IconHeart, IconInfoCircle } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import BackButton from '../../components/backButton';
import FabButton from '../../components/fabButton';
import FilterList from '../../components/filter';
import TextHeader from '../../components/iconTextHeader';
import Item from '../../components/item';
import BasicMasonry from '../../components/masonry/basicMasonry';
import Modal from '../../container/modal';
import activityFilter from '../../data/activityFilter';
import { getFireCollection, getFireDocument } from '../../data/fire';
import { Cat } from '../../interfaces/categorie';

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
      const listData = await getFireCollection(`lists/${listID}_${uid}/listItems`, false, [['title.form', '==', listID]]);
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
  const openFilter = () => setOpenModal('Filtern');

  useEffect(() => { getList(); }, [listID]);

  return (
    <Fragment>
      <BackButton url="/lists" title="Zurück" />

      <TextHeader
        icon={<IconHeart />}
        title={list?.title.name || ''}
        text={list?.description || ''}
      />
      {/* <Item type="large" title={category?.title.name || ''}
        text="Bitte geben Sie hier den Namen Ihrer Unternehmung an z.B. „Lasertag Licht und mehr“.
        Der Name Ihrer Unternehmung ist ihr öffentliches Label" /> */}

      <main style={{ padding: '20px 10px' }} class="size_holder">

        {cats === undefined && <Item icon={<IconInfoCircle />} type="info" label="Es wurde nichts in deiner Nähe gefunden" text="Überprüfe deinen Standort oder wähle eine andere Aktivität" />}

        <BasicMasonry list={cats} />

      </main>

      <FabButton icon={<IconAdjustmentsHorizontal size={35} color="#581e0d" />} hide={!!openModal} action={openFilter} />
      {!!openModal && (
      <Modal title={openModal} close={closeModal}>
        {openModal === 'Filtern' && <FilterList data={activityFilter} values={filter} change={updateFilter} close={closeModal} />}
      </Modal>
      )}
    </Fragment>
  );
};

export default ListDetails;
