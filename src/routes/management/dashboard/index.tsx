import { Fragment, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { Link, route } from 'preact-router';
import { AlignJustify, Home } from 'react-feather';

import BackButton from '../../../components/backButton';
import Chip from '../../../components/chip';
import TextHeader from '../../../components/iconTextHeader';
import Item from '../../../components/item';
import Modal from '../../../container/modal';
import useCompany from '../../../hooks/useCompany';
import { Activity } from '../../../interfaces/activity';
import Check from './check';
import companyRoutes from './routes';
import style from './style.module.css';

interface ActivityProp {
    activityID: string;
    activity: Activity;
}

const Dashboard: FunctionalComponent<ActivityProp> = ({ activity, activityID }: ActivityProp) => {
  const data = useCompany(activityID, activity);
  if (!data) {
    return (
      <TextHeader
        icon={<Home color="#ff5613" />}
        title=""
        text="Willkommen in Ihrer Unternehmensverwaltung. Hier können Sie ihre angegebenen Informationen verwalten. Wenn Sie Fragen haben, wenden Sie sich an den Support."
      />
    );
  }

  const [openModal, setOpenModal] = useState(false);
  return (
    <Fragment>
      <TextHeader
        image={`https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/activities%2F${activityID}%2F${activityID}_250x200`}
        title={`${data.title.name} (${data.category.name})`}
        text="Willkommen in Ihrer Unternehmensverwaltung. Hier können Sie ihre angegebenen Informationen verwalten. Wenn Sie Fragen haben, wenden Sie sich an den Support."
      />
      <main>
        <BackButton url="/company" title="Liste" />
        <div class="small_size_holder" style={{ paddingTop: '20px' }}>
          <Item icon={<AlignJustify />} type="warning" label="(45%) Fast geschafft - Jetzt die nächsten Schritte ansehen" action={() => setOpenModal(true)} />
        </div>

        <div class={`${style.basic} size_holder`}>
          {companyRoutes.basic.map((x) => (
            <Item icon={x.icon} label={x.title} type="info" action={() => route(`${x.path}/${data.title.form}`)} />
          ))}
        </div>
        <div class={`${style.reservation} size_holder`}>
          {companyRoutes.reservation.map((x) => (
            <Link key={x.title} href={`${x.path}/${data.title.form}`} class={style.dashItem}>
              {x.icon && x.icon}
              <strong>{x.title}</strong><br />
              <small>{x.text}</small>
            </Link>
          ))}
        </div>
        <div class={style.tools}>
          <div>
            {/* <Chip label="✓ Die nächsten schritte (45%)" small type="warning" action={() => setOpenModal(true)} />
            <Chip label="Online stellen" small type="disabled" action={() => console.log('da')} /> */}
            <Chip label="Support - Wenn du Hilfe brauchst" small type="grey" action={() => console.log('da')} />
          </div>
          <div>
            <Chip label="Alles Löschen" small type="delete" action={() => console.log('da')} />
          </div>
        </div>
        {openModal && <Modal title="" close={() => setOpenModal(false)}><Check activity={data} /></Modal>}
      </main>
    </Fragment>
  );
};

export default Dashboard;
