import { IconAlertCircle, IconClock, IconColumns, IconCurrencyDollar, IconDeviceDesktopAnalytics, IconHome, IconInfoCircle, IconPhoto, IconWriting } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';

import FormButton from '../../../../components/form/basicButton';
import Item from '../../../../components/item';
import Modal from '../../../../container/modal';
import { setActivityOnline } from '../../../../data/fire';
import { Activity } from '../../../../interfaces/activity';

interface CheckProp {
    activity: Activity;
}

const Check: FunctionalComponent<CheckProp> = ({ activity }: CheckProp) => {
  const [openModal, setOpenModal] = useState(false);
  const [notFinished, setNotFinished] = useState([]);

  const [checkData, setCheckData] = useState<{
    percent: number,
    isReady: boolean,
    isOnline: boolean,
  }>({
    percent: 0,
    isReady: false,
    isOnline: false,
  });

  const checkListItems = [
    { percent: 10, title: 'Lade ein Anzeigebild hoch', description: 'Das Anzeigebild ist der erste Eindruck für die Nutzer.', icon: <IconPhoto color="#ff375e" />, color: 'danger', link: 'basic', check: !activity.state?.includes('thumbnail'), required: true },
    { percent: 10, title: 'Gebe Deine Beschreibung an', description: 'Beschreibe Deine Aktivität', color: 'danger', icon: <IconInfoCircle color="#63e6e1" />, link: 'basic', check: !activity.description, required: true },
    { percent: 10, title: 'Füge Deine Adresse hinzu', description: 'Wo befindet sich die Aktivität', icon: <IconHome color="#ff5613" />, color: 'danger', link: 'contact', check: !activity.address?.street, required: true },
    { percent: 10, title: 'Gebe Deine Öffnungszeiten an', description: 'Wann seit Ihr für die Nutzer verfügbar.', icon: <IconClock color="#63d2ff" />, color: 'danger', link: 'openings', check: !activity.openings, required: true },
    { percent: 10, title: 'Definiere Deine Leistungen', description: 'Welche Leistungen stellt ihr zur verfügung', color: 'danger', link: 'services', check: !activity.state?.includes('services') },
    { percent: 10, title: 'Gebe die Verfügbarkeiten an', description: 'Wann sind eure Leistungen verfügbar', icon: <IconColumns color="#bf5bf3" />, color: 'danger', link: 'availabilities', check: !activity.state?.includes('available') },
    { percent: 10, title: 'Definiere die Preise', description: 'Welche Preise haben eure Leistungen', color: 'danger', icon: <IconCurrencyDollar color="#fea00a" />, link: 'prices', check: !activity.state?.includes('prices') },

    { percent: 10, title: 'Bis zu 4 Bilder hinzufügen', description: 'Wie sieht eure Aktivität aus', color: 'warning', icon: <IconPhoto color="#ff375e" />, link: 'images', check: !activity?.state?.includes('image4'), required: true },
    { percent: 10, title: 'Gebe Kontaktinfos an.', description: 'Wie können Nutzer euch erreichen', color: 'warning', icon: <IconHome color="#ff5613" />, link: 'contact', check: (!activity.customerContact?.website || !activity.guidexContact?.name), required: true },
    { percent: 10, title: 'Vertragsbedingungen zustimmn', description: 'Damit unsere Partnerschaft beginnen kann, stimmen sie bitte den Vertragsbedingungen zu', color: 'warning', icon: <IconWriting color="#ff375e" />, link: 'contract', check: !activity?.termsAccepted, required: true },
  ];

  const generatePercent = () => {
    const notFinishedList: any = [];
    let percent: number = 0;
    let isReady: boolean = true;

    checkListItems.forEach((x) => {
      if (isReady && x.required && x.check) isReady = false;
      if (x.check) return notFinishedList.push(x);
      percent += x.percent;
    });

    setCheckData({ percent, isReady, isOnline: !!activity.state?.includes('online') });
    setNotFinished(notFinishedList);
  };

  // const getPrecision = (radius: number) => {
  //   if (radius < 0.019) {
  //     // 19 metres
  //     return 9;
  //   } if (radius < 0.152) {
  //     // 152 metres
  //     return 8;
  //   } if (radius < 0.61) {
  //     return 7;
  //   } if (radius < 4.9) {
  //     return 6;
  //   } if (radius < 19.5) {
  //     return 5;
  //   } if (radius < 156) {
  //     return 4;
  //   } if (radius < 625) {
  //     return 3;
  //   } if (radius < 5000) {
  //     return 2;
  //   }
  //   return 1;
  // };

  // const getGeoHashes = () => {
  //   const precision = getPrecision(radius);
  //   const currentPosition = geohash.encode(latitude, longitude);
  //   const geohashArray = geohash.neighbors(currentPosition.substring(0, precision));
  //   geohashArray.push(currentPosition.substring(0, precision));
  // };

  const toggleActivityState = () => {
    if (activity.title.form && activity.category.form) {
      const locationFilter: ('lo_indoor' | 'lo_outdoor')[] = [];
      activity.filter.forEach((x: string) => {
        if (x === 'Indoor') locationFilter.push('lo_indoor');
        if (x === 'Outdoor') locationFilter.push('lo_outdoor');
      });
      // const geohashes: [string, string, string, string, string, string, string, string, string] = getGeoHashes();
      setActivityOnline(activity.title.form, locationFilter, activity.category.form);
      setCheckData({ ...checkData, isOnline: !checkData.isOnline });
    }
  };

  useEffect(() => { generatePercent(); }, [activity]);

  return (
    <Fragment>
      {checkData.isOnline ? (
        <Item type="success" label="Ihre Unternehmung ist online" action={() => setOpenModal(true)} />
      ) : (
        <Item type="success" label={`${checkData.percent}% ${checkData.isReady ? 'Erledigt - Online stellen' : 'abgeschlossen - Die letzten Schritte ansehen'}`} action={() => setOpenModal(true)} />
      )}

      {openModal && (
        <Modal title="" close={() => setOpenModal(false)}>
          {checkData.isOnline ? (
            <Fragment>
              <h2 style={{ marginTop: '0' }}>Ihre Unternehmung ist online</h2>
              <p style={{ marginTop: '0', padding: '10px 0', color: 'var(--fifth)' }}>Ihre Unternehmung ist bei uns gelistet und für alle Nutzer verfügbar.</p>
              <FormButton disabled={checkData.percent < 100} label="Unternehmung offline stellen" action={toggleActivityState} />
              <Item icon={<IconAlertCircle color="var(--orange)" />} type="info" label="Info" text="Wenn sie Ihre Unternehmung offline stellen, können sie nicht mehr auf unserer Seite gefunden werden. Jedoch, bleiben ihre Daten bestehen und können im Mitgliederbereich bearbeitet werden." />
            </Fragment>
          ) : (
            <Fragment>
              {checkData.percent < 100 ? (
                <Fragment>
                  <h2 style={{ marginTop: '0' }}>Die letzen Schritte</h2>
                  <p style={{ marginTop: '0', padding: '10px 0', color: 'var(--fifth)' }}>Im Folgenden sind alle noch zu erledigenden Schritte aufgelistet. Diese müssen abgeschlossen werden, um Ihre Unternehmung online zu stellen.</p>
                </Fragment>
              ) : (
                <Fragment>
                  <h2 style={{ marginTop: '0' }}>Es ist geschafft</h2>
                  <p style={{ marginTop: '0', padding: '10px 0', color: 'var(--fifth)' }}>
                    Ihre Unternehmung ist jetzt bereit online gestellt zu werden.
                    Der erste Eindruck zählt, daher empfiehlt es sich die Unternehmung in der Vorschau zu überprüfen.
                  </p>
                  <Item icon={<IconDeviceDesktopAnalytics color="var(--blue)" />} type="info" label="Jetzt Vorschau ansehen" text="Siehe Dir die Vorschau und Verbesserungsvorschläge an" />
                </Fragment>
              )}
              {checkData.percent < 100 && (
              <section class="form group">
                {notFinished.map((item: any) => (
                  <Item label={item.title} text={item.description} icon={item.icon || <IconHome />} key={item.title} action={() => route(`/company/${item.link}/${activity.title.form}`)} type="large" />
                ))}
              </section>
              )}
              <FormButton disabled={checkData.percent < 100} label="Unternehmung online stellen" action={toggleActivityState} />
            </Fragment>
          )}

        </Modal>
      )}
    </Fragment>
  );
};

export default Check;
