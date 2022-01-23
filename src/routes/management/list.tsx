import { Fragment, FunctionalComponent, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { PlayCircle } from 'react-feather';
import Item from '../../components/item';
import TextHeader from '../../components/iconTextHeader';
import { getFireCollection } from '../../data/fire';
import { Activity } from '../../interfaces/activity';

interface ListProps {
    setActivity: (activity: Activity | undefined) => void;
}

const List: FunctionalComponent<ListProps> = ({ setActivity }: ListProps) => {
  const [list, setList] = useState<any[] | undefined | false>(false);

  const fetchActivities = async () => {
    console.log('neue activites');
    const data: any = await getFireCollection('activities', false);
    setList(data || undefined);
  };

  useEffect(() => {
    if (list === false) fetchActivities();
  }, []);

  return (
    <Fragment>
      <TextHeader
        title="Unternehmungen"
        text="Wähle eine Unternehmung die du verwalten möchtest. Oder lege eine neue an."
      />
      <main class="small_size_holder">
        <Item label="Neue Unternehmung hinzufügen" type="grey" icon={<PlayCircle />} link="/company/basic/new" action={() => setActivity(undefined)} />

        <div>
          {list ? list.map((x) => (
            <Item label={x.title.name} text={x.address?.street || undefined} action={() => setActivity(x)} link={`/company/dashboard/${x.title.form}`} image={`https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/activities%2F${x.title.form}%2F${x.title.form}_250x200`} />
          )) : (
            list !== false && <p style={{ textAlign: 'center', color: '#6c7293' }}>Es wurden noch keine Unternehmungen angelegt.</p>
          )}
        </div>
      </main>
    </Fragment>
  );
};

export default List;
