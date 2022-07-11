import { Fragment, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { Link, route } from 'preact-router';

import BackButton from '../../../components/backButton';
import Chip from '../../../components/chip';
import FormButton from '../../../components/form/basicButton';
import TextHeader from '../../../components/infos/iconTextHeader';
import Popup from '../../../container/popup';
import { deleteFireDocument } from '../../../data/fire';
import useCompany from '../../../hooks/useCompany';
import { Activity } from '../../../interfaces/activity';
import Check from './check';
import companyRoutes, { Pages } from './routes';
import style from './style.module.css';

interface ActivityProp {
    activityID: string;
    activity: Activity;
}

const Dashboard: FunctionalComponent<ActivityProp> = ({ activity, activityID }: ActivityProp) => {
  const data: Activity | undefined = useCompany(activityID, activity);
  const dashboardText = 'Willkommen in Ihrer Unternehmensverwaltung. Hier können Sie ihre angegebenen Informationen verwalten. Wenn Sie Fragen haben, wenden Sie sich an den Support.';

  const [openDelete, setOpenDelete] = useState<boolean>();

  const closeDelete = () => setOpenDelete(false);

  const deleteActivity = () => {
    deleteFireDocument(`activities/${activityID}`);
    route('/company');
  };

  if (!data) {
    return (
      <TextHeader
        image="fd"
        title=""
        text={dashboardText}
      />
    );
  }

  return (
    <Fragment>
      <TextHeader
        image={data.state?.includes('thumbnail') ? `https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/activities%2F${activityID}%2F${activityID}_250x200` : undefined}
        title={`${data.title.name} (${data.category.name})`}
        text={dashboardText}
      />
      <main>
        <BackButton url="/company" title="Liste" />
        <div class="small_size_holder" style={{ paddingTop: '20px' }}>
          <Check activity={data} />
        </div>

        <div class={style.dashboardItems}>
          {Object.entries(companyRoutes).map(([routeTitle, pages]: [string, Pages[]]) => (
            <div>
              <h3>{routeTitle}</h3>
              <div class={style.dashItem}>
                {pages.map((x) => (
                  <Link key={x.title} href={`${x.path}/${data.title.form}`} class={style.dasher}>
                    <div>
                      {x.icon && x.icon}
                      <strong>{x.title}</strong><br />
                      <small>{x.text}</small>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* <div class={`${style.basic} size_holder`}>
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
        </div> */}
        <div class={style.tools}>
          <div>
            <Chip label="Support - Wenn du Hilfe brauchst" type="grey" action={() => console.log('da')} />
          </div>
          <div>
            <Chip label="Erlebnis Löschen" type="delete" action={() => setOpenDelete(true)} />
          </div>
        </div>
      </main>

      {openDelete && (
        <Popup close={closeDelete}>
          {data.state?.includes('online') ? (
            <p style={{ color: 'var(--orange)' }}>Damit Sie die Aktiviät löschen können, müssen Sie vorher diese Offline stellen.</p>
          ) : (
            <p>Sind Sie sicher das Sie die Aktivität unwiederruflich löschen wollen?</p>
          )}
          <FormButton label="Aktivität löschen" disabled={!!data.state?.includes('online')} action={deleteActivity} />
          <FormButton label="Abbrechen" type="outline" action={closeDelete} />
        </Popup>
      )}
    </Fragment>
  );
};

export default Dashboard;
