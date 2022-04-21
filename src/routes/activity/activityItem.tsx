import { FunctionalComponent, h } from 'preact';
import { Link } from 'preact-router';

import { shortDay } from '../../helper/date';
import { Activity } from '../../interfaces/activity';
import style from './style.module.css';

interface ActivityItemProps {
    activity: Activity,
    dayNr?: number,
}

const ActivityItem: FunctionalComponent<ActivityItemProps> = ({ activity, dayNr }: ActivityItemProps) => {
  const getOpenings = (): string => {
    const dayNumber = dayNr || new Date().getDay();
    const getTime = activity.openings?.[dayNumber];
    if (getTime) return `${shortDay[dayNumber]}, Bis ${getTime.split('-')[1]} geöffnet`;
    return 'geschlossen';
  };
  return (
    <Link class={style.activityItem} href={`/activity/${activity.category?.form}/${activity.title.form}`}>
      <div class={style.image}>
        <picture>
          <source srcSet={`https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/activities%2F${activity.title.form}%2F${activity.title.form}_250x200.webp?alt=media`} type="image/webp" />
          <img loading="lazy" src={`https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/activities%2F${activity.title.form}%2F${activity.title.form}_250x200.jpeg?alt=media`} alt={activity.title.name} />
        </picture>
      </div>
      <div class={style.content}>
        <h2>
          {activity.title.name}&nbsp;
        </h2>
        <small style={{ color: 'var(--fifth)' }}>
          <span style={{ color: 'var(--orange)' }}>{[1, 2, 3, 4, 5].map((x) => (
            x <= (activity.rating?.reduce((a, b, index: number) => a + (b * (index + 1)), 0) || 0) ? <span key={x} style={{ color: 'var(--orange)' }}>★</span> : <span key={x} style={{ color: 'var(--fifth)' }}>★</span>
          ))}
          </span>
          &nbsp;(200 Bewertungen)
        </small>
        <table cellSpacing="0" cellPadding="0">
          <tbody>
            <tr><td>💶 10 - 20 €</td><td>👩‍👧 10 - 15 Pers.</td></tr>
            <tr><td>⏱ ab 30 Min.</td><td style={{ color: getOpenings() === 'geschlossen' ? 'var(--red)' : 'var(--green)' }}>{getOpenings()}</td></tr>
          </tbody>
        </table>
      </div>
    </Link>
  );
};

export default ActivityItem;
