import { FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';
import { Clock, Columns, DollarSign, Home, Image, Info } from 'react-feather';

import Item from '../../../../components/item';
import { Activity } from '../../../../interfaces/activity';
import style from './style.module.css';

interface CheckProp {
    activity: Activity;
}

const Check: FunctionalComponent<CheckProp> = ({ activity }: CheckProp) => {
  const checkListItems = [
    { title: 'Lade ein Anzeigebild hoch', description: 'Das Anzeigebild ist der erste Eindruck für die Nutzer.', icon: <Image color="#ff375e" />, color: 'danger', link: 'basic', check: !activity.state?.includes('thumbnail') },
    { title: 'Gebe Deine Beschreibung an', description: 'Beschreibe Deine Aktivität', color: 'danger', icon: <Info color="#63e6e1" />, link: 'basic', check: !activity.description },
    { title: 'Füge Deine Adresse hinzu', description: 'Wo befindet sich die Aktivität', icon: <Home color="#ff5613" />, color: 'danger', link: 'contact', check: !activity.address },
    { title: 'Gebe Deine Öffnungszeiten an', description: 'Wann seit Ihr für die Nutzer verfügbar.', icon: <Clock color="#63d2ff" />, color: 'danger', link: 'openings', check: !activity.openings },
    { title: 'Definiere Deine Leistungen', description: 'Welche Leistungen stellt ihr zur verfügung', color: 'danger', link: 'services', check: !activity.state?.includes('service') },
    { title: 'Gebe die Verfügbarkeiten an', description: 'Wann sind eure Leistungen verfügbar', icon: <Columns color="#bf5bf3" />, color: 'danger', link: 'availabilities', check: !activity.state?.includes('available') },
    { title: 'Definiere die Preise', description: 'Welche Preise haben eure Leistungen', color: 'danger', icon: <DollarSign color="#fea00a" />, link: 'prices', check: !activity.state?.includes('prices') },

    { title: 'Bis zu 4 Bilder hinzufügen', description: 'Wie sieht eure Aktivität aus', color: 'warning', icon: <Image color="#ff375e" />, link: 'images', check: !activity?.state?.includes('image4') },
    { title: 'Erweitere die Beschreibung auf 500 Zeichen.', description: 'Gebe eine detailiertere Beschreibung', icon: <Info color="#63e6e1" />, color: 'warning', link: 'basic', check: activity.description && activity.description.length < 500 },
    { title: 'Gebe Kontaktinfos an.', description: 'Wie können Nutzer euch erreichen', color: 'warning', icon: <Home color="#ff5613" />, link: 'contact', check: (!activity.customerContact?.website || !activity.guidexContact?.name) },
  ];

  return (
    <div class={style.check}>
      <h2 style={{ marginTop: '0', padding: '0 10px 3px 10px' }}>Die nächsten Schritte</h2>
      <p class="grey" style={{ marginTop: '0', padding: '0 10px 10px 10px' }}>Erledigen sie die aufgelisteten Punkte um die Aktivität online stellen zu können. Bei Fragen melden sie sich an den Support.</p>
      <section class="group">
        {checkListItems.map((item) => item.check && (
          <Item label={item.title} text={item.description} icon={item.icon || <Home />} key={item.title} action={() => route(item.link)} type="large" />
        ))}
      </section>
    </div>
  );
};

export default Check;
