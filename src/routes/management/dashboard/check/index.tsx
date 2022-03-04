import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { AlignJustify, Clock, Columns, DollarSign, Home, Image, Info } from 'react-feather';

import FormButton from '../../../../components/form/basicButton';
import Item from '../../../../components/item';
import Modal from '../../../../container/modal';
import { Activity } from '../../../../interfaces/activity';

interface CheckProp {
    activity: Activity;
}

const Check: FunctionalComponent<CheckProp> = ({ activity }: CheckProp) => {
  const [openModal, setOpenModal] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [notFinished, setNotFinished] = useState([]);
  const [percent, setPercent] = useState<number>(0);

  const checkListItems = [
    { percent: 10, title: 'Lade ein Anzeigebild hoch', description: 'Das Anzeigebild ist der erste Eindruck für die Nutzer.', icon: <Image color="#ff375e" />, color: 'danger', link: 'basic', check: !activity.state?.includes('thumbnail'), required: true },
    { percent: 15, title: 'Gebe Deine Beschreibung an', description: 'Beschreibe Deine Aktivität', color: 'danger', icon: <Info color="#63e6e1" />, link: 'basic', check: !activity.description, required: true },
    { percent: 15, title: 'Füge Deine Adresse hinzu', description: 'Wo befindet sich die Aktivität', icon: <Home color="#ff5613" />, color: 'danger', link: 'contact', check: !activity.address, required: true },
    { percent: 15, title: 'Gebe Deine Öffnungszeiten an', description: 'Wann seit Ihr für die Nutzer verfügbar.', icon: <Clock color="#63d2ff" />, color: 'danger', link: 'openings', check: !activity.openings, required: true },
    { percent: 5, title: 'Definiere Deine Leistungen', description: 'Welche Leistungen stellt ihr zur verfügung', color: 'danger', link: 'services', check: !activity.state?.includes('services') },
    { percent: 5, title: 'Gebe die Verfügbarkeiten an', description: 'Wann sind eure Leistungen verfügbar', icon: <Columns color="#bf5bf3" />, color: 'danger', link: 'availabilities', check: !activity.state?.includes('available') },
    { percent: 5, title: 'Definiere die Preise', description: 'Welche Preise haben eure Leistungen', color: 'danger', icon: <DollarSign color="#fea00a" />, link: 'prices', check: !activity.state?.includes('prices') },

    { percent: 10, title: 'Bis zu 4 Bilder hinzufügen', description: 'Wie sieht eure Aktivität aus', color: 'warning', icon: <Image color="#ff375e" />, link: 'images', check: !activity?.state?.includes('image4'), required: true },
    { percent: 5, title: 'Erweitere die Beschreibung auf 500 Zeichen.', description: 'Gebe eine detailiertere Beschreibung', icon: <Info color="#63e6e1" />, color: 'warning', link: 'basic', check: activity.description && activity.description.length < 500 },
    { percent: 15, title: 'Gebe Kontaktinfos an.', description: 'Wie können Nutzer euch erreichen', color: 'warning', icon: <Home color="#ff5613" />, link: 'contact', check: (!activity.customerContact?.website || !activity.guidexContact?.name), required: true },
  ];

  const generatePercent = () => {
    const notFinishedList: any = [];
    let percentage: number = 0;
    let ready: boolean = true;

    checkListItems.forEach((x) => {
      if (ready && x.required && x.check) ready = false;
      if (x.check) return notFinishedList.push(x);
      percentage += x.percent;
    });

    setPercent(percentage);
    setIsReady(ready);
    setNotFinished(notFinishedList);
  };

  useEffect(() => { generatePercent(); }, [activity]);

  return (
    <Fragment>
      <Item icon={<AlignJustify />} type="warning" label={`(${percent}%) ${isReady ? 'Erledigt - Jetzt online stellen' : 'Fast geschafft - Jetzt die nächsten Schritte ansehen'}`} action={() => setOpenModal(true)} />

      {openModal && (
        <Modal title="" close={() => setOpenModal(false)}>
          <Fragment>
            <h2 style={{ marginTop: '0' }}>({percent}%) Die nächsten Schritte</h2>
            <p style={{ marginTop: '0', padding: '10px 0', color: 'var(--fifth)' }}>Erledigen sie die aufgelisteten Punkte um die Aktivität online stellen zu können. Bei Fragen melden sie sich an den Support.</p>
            <FormButton label="Unternehmung jetzt online stellen" disabled />
            <section class="form group">
              {notFinished.map((item: any) => (
                <Item label={item.title} text={item.description} icon={item.icon || <Home />} key={item.title} action={() => route(`/company/${item.link}/${activity.title.form}`)} type="large" />
              ))}
            </section>
          </Fragment>
        </Modal>
      )}
    </Fragment>
  );
};

export default Check;
