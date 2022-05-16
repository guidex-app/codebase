import { IconSquarePlus } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import BackButton from '../../components/backButton';
import TextHeader from '../../components/iconTextHeader';
import Item from '../../components/item';
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
      <BackButton title="Startseite" url="/" />
      <TextHeader
        title="Unternehmungen"
        text="Wähle eine Unternehmung die du verwalten möchtest. Oder lege eine neue an."
      />
      <main class="small_size_holder">
        <Item label="Neue Unternehmung hinzufügen" type="grey" icon={<IconSquarePlus />} link="/company/basic/new" action={() => setActivity(undefined)} />

        {list ? list.map((x) => (
          <Item label={x.title.name} text={`${x.state?.includes('online') ? 'Online' : 'Offline'} · ${x.address?.street || undefined}`} action={() => setActivity(x)} link={`/company/dashboard/${x.title.form}`} image={x.state?.includes('thumbnail') ? `https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/activities%2F${x.title.form}%2F${x.title.form}_250x200` : undefined} />
        )) : (
          list !== false && <p style={{ textAlign: 'center', color: 'var(--fifth)' }}>Es wurden noch keine Unternehmungen angelegt.</p>
        )}
      </main>
    </Fragment>
  );
};

export default List;
