import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Feather, Info } from 'react-feather';
import BackButton from '../../components/backButton';
import FabButton from '../../components/fabButton';
import TextHeader from '../../components/iconTextHeader';
import { getFireCollection, getFireDocument } from '../../data/fire';
import { Activity } from '../../interfaces/activity';
import { Cat } from '../../interfaces/categorie';
import ActivityItem from './activityItem';
import style from './style.module.css';

interface ActivitiesProps {
    categoryID: string;
}

const ActivityList: FunctionalComponent<ActivitiesProps> = ({ categoryID }: ActivitiesProps) => {
  const [category, setCategory] = useState<Cat | undefined>();
  const [list, setList] = useState<Activity[] | undefined | false>(false);
  const [openModal] = useState<'filter' | 'addToList' | false>(false);
  // const closeModal = () => setOpenModal(false);

  const getActivityList = () => {
    if (categoryID) {
      getFireCollection('activities', false, [['category.form', '==', categoryID]]).then((listData: Activity[]) => {
        if (listData) setList(listData);
      });
    }
  };

  const getCategorie = () => {
    if (categoryID) {
      getFireDocument(`catInfos/${categoryID}`).then((data: Cat) => {
        if (data.title.form) {
          setCategory(data);
          getActivityList();
        }
      });
    }
  };

  useEffect(() => {
    getCategorie();
  }, [categoryID]);

  return (
    <Fragment>
      <TextHeader
        icon={<Info color="#fea00a" />}
        title={category?.title.name || ''}
        text="Bitte geben Sie hier den Namen Ihrer Unternehmung an z.B. „Lasertag Licht und mehr“.
        Der Name Ihrer Unternehmung ist ihr öffentliches Label"
      />
      <main style={{ padding: '20px 10px' }} class="size_holder">
        <BackButton url="/" title="Zurück" />
        <div class={style.list}>
          {list && list?.map((x: Activity) => <ActivityItem activity={x} />)}
        </div>

        <FabButton icon={<Feather size={35} color="#581e0d" />} hide={!!openModal} action={() => console.log('test')} />
        {/* <IonModal
          isOpen={!!openModal}
          onDidDismiss={closeModal}
          cssClass="small"
        >
          <Suspense fallback={<ListLoading />}>
            {openModal === 'filter' && (
              <ActivityFilter initialFilter={['so_distance', 'ra_ten']} close={closeModal} />
            )}
            {openModal === 'addToList' && catDetails?.title?.name && (
              <AddToListChooser
                categoryTitle={catDetails.title.name}
                onDismissModal={closeModal}
              />
            )}
          </Suspense>

        </IonModal> */}
      </main>
    </Fragment>
  );
};

export default ActivityList;
