import { IconBrandGoogleAnalytics, IconClock, IconCreditCard, IconCurrencyDollar, IconDoorEnter, IconEye, IconHome, IconInfoCircle, IconPhoto, IconSelect, IconStar, IconWriting } from '@tabler/icons';
import { h } from 'preact';

export interface Pages {
    title: string,
    text?: string,
    path: string,
        dependency?: string[]
    routerDirection?: string,
    icon?: any,
  }

const companyRoutes: { [key: string]: Pages[] } = {
  Grundlagen: [
    { title: 'Einrichtung', text: 'Wer sind Sie und was macht Sie aus?', path: '/company/basic', dependency: ['title', 'category'], icon: <IconInfoCircle color="#fb823b" /> },
    { title: 'Kontakt', text: 'Wie können wir Sie erreichen?', path: '/company/contact', dependency: ['address'], icon: <IconHome color="#fb823b" /> },
  ],
  Informationen: [
    { title: 'Öffnungszeiten', text: 'Wann haben Sie geöffnet?', path: '/company/openings', icon: <IconClock color="#c2429f" /> },
    { title: 'Spezifisch', text: 'Was müssen Nutzer noch wissen?', path: '/company/specific', icon: <IconStar color="#c2429f" /> },
  ],
  Fotos: [
    { title: 'Fotos', text: 'Wie sieht es bei Ihnen aus?', path: '/company/images', icon: <IconPhoto color="#b555dd" /> },
  ],
  Unterlagen: [
    { title: 'Dokumente', text: 'Wie lauten Ihre AGBs & Widerrufsbelehrung', path: '/company/documents', icon: <IconCreditCard color="#4ee0a1" /> },
    { title: 'Rechtliches & Vertragliches', text: 'Wie sieht der Vertrag aus?', path: '/company/contract', icon: <IconWriting color="#4ee0a1" /> },
  ],
  Leistungen: [
    { title: 'Leistungen', path: '/company/services', text: 'Wie sieht Ihr Angebot aus?', icon: <IconSelect color="#25a7ff" /> },
    { title: 'Preise', path: '/company/prices', text: 'Wie gestalten sich die Preise?', icon: <IconCurrencyDollar color="#25a7ff" /> },
  ],
  Verfügbarkeit: [
    { title: 'Reservierungen', text: 'Was wurde bereits reserviert?', path: '/company/reservations', icon: <IconEye color="#eca975" /> },
    { title: 'Verfügbarkeiten', text: 'Wie viele Kapazitäten haben Sie?', path: '/company/availabilities', icon: <IconDoorEnter color="#eca975" /> },
  ],
  Analyse: [
    { title: 'Analytics', path: '/company/reservations', text: 'Reichweite und Statistiken', icon: <IconBrandGoogleAnalytics color="yellow" /> },
    { title: 'Bewertungen', path: '/company/reservations', text: 'Was sagen unsere Nutzer?', icon: <IconStar color="yellow" /> },
  ],
  Reichweite: [
    { title: 'Influencer', text: 'Ihr Influencer Marketing', path: '/company/influencer', icon: <IconEye color="lightblue" /> },
  ],
  // disabled: [
  //   { title: 'Nutzer', path: '/company/user', text: 'Verwalte Deine ' },
  //   { title: 'Rezensionen', path: '', text: 'Verwalte Deine ' },
  //   { title: 'Einbettungen', path: '', text: 'Verwalte Deine ' },
  //   { title: 'Analytics', path: '', text: 'Verwalte Deine ' },
  // ],
};

export default companyRoutes;
