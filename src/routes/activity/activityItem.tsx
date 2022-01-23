import { FunctionalComponent, h } from 'preact';
import { Link } from 'preact-router/match';
import { Activity } from '../../interfaces/activity';
import style from './style.module.css';

interface ActivityItemProps {
    activity: Activity
}

const ActivityItem: FunctionalComponent<ActivityItemProps> = ({ activity }: ActivityItemProps) => {
  const getOpenings = (): string => {
    const getTime = activity.openings?.[new Date().getDay()];
    if (getTime) return `Bis ${getTime.split('-')[1]} geöffnet`;
    return 'geschlossen';
  };
  return (
    <Link class={style.activity} href={`/activity/${activity.category.form}/${activity.title.form}`}>
      <div class={style.image}>
        <picture>
          <source srcSet={`https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/activities%2F${activity.title.form}%2F${activity.title.form}_250x200.webp?alt=media`} type="image/webp" />
          <img loading="lazy" src={`https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/activities%2F${activity.title.form}%2F${activity.title.form}_250x200.jpeg?alt=media`} alt={activity.title.name} />
        </picture>
      </div>
      <div>
        <h2>
          {activity.title.name}&nbsp;
          <span class="orange">{[1, 2, 3, 4, 5].map((x) => (
            x <= (activity.rating?.reduce((a, b, index: number) => a + (b * (index + 1)), 0) || 0) ? <span key={x} class="orange">⋆</span> : <span key={x} class="grey">⋆</span>
          ))}
          </span>
        </h2>
        <p class="grey" style={{ margin: 0 }}><small>{activity.address?.street || ''} (500 Meter)</small></p>
        <table cellSpacing="0" cellPadding="0">
          <tbody>
            <tr><td>💶 10 - 20 €</td><td>👩‍👧 10 - 15 Pers.</td></tr>
            <tr><td>⏱ ab 30 Min.</td><td class={getOpenings() === 'geschlossen' ? 'red' : 'green'}>{getOpenings()}</td></tr>
          </tbody>
        </table>
      </div>
    </Link>
  );
};

export default ActivityItem;
