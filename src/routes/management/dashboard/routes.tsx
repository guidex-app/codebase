import { h } from 'preact';
import { Home, Clock, Star, Archive, CreditCard, Info, DollarSign, Columns, Image, Monitor } from 'react-feather';

export interface Pages {
    title: string,
    subTitle: string,
    path: string,
    color: string,
        dependency?: string[]
    routerDirection?: string,
    icon?: any,
  }

const companyRoutes: { [key: string]: Pages[] } = {
  pages: [
    { title: 'Einrichtung', path: '/company/basic', dependency: ['title', 'category'], subTitle: 'Verwalte Deine Basisinfos', color: 'tertiary', icon: <Info color="#63e6e1" /> },
    { title: 'Kontakt', path: '/company/contact', dependency: ['address'], subTitle: 'Deine Kontaktdaten', color: 'tertiary', icon: <Home color="#ff5613" /> },
    { title: 'Öffnungszeiten', path: '/company/openings', subTitle: 'Öffnungszeiten anpassen', color: 'tertiary', icon: <Clock color="#63d2ff" /> },
    { title: 'Spezifisch', path: '/company/specific', subTitle: 'Spezifische Infos anpassen', color: 'tertiary', icon: <Star color="#2fd159" /> },
    { title: 'Bilder', path: '/company/images', subTitle: 'Bilder anpassen', color: 'success', icon: <Image color="#ff375e" /> },
    { title: 'Leistungen verwalten', path: '/company/services', subTitle: 'Lege deine Leistungen an', color: 'warning', icon: <Archive color="#0983fe" /> },
    { title: 'Rabatte konfigurieren', path: '/company/structure', subTitle: 'Preisstrucktur der Leistungen', color: 'info', icon: <DollarSign color="#fea00a" /> },
    { title: 'Preise angeben', path: '/company/prices', subTitle: 'Preise definieren', color: 'info', icon: <CreditCard color="#66d4cf" /> },
    { title: 'Verfügbarkeiten', path: '/company/availabilities', subTitle: 'Verfügbarkeiten der Leistungen', color: 'warning', icon: <Columns color="#bf5bf3" /> },
    { title: 'Reservierungen', path: '/company/reservations', subTitle: 'Reservierungen einsehen', color: 'danger', icon: <Columns color="#d4be21" /> },
    { title: 'Dokumente', path: '/company/documents', subTitle: 'Dokumene hochladen', color: 'danger', icon: <CreditCard color="#d4be21" /> },
  ],
  disabled: [
    { title: 'Vorschau', path: '/company/dashboard', subTitle: 'Coming soon', color: 'danger', icon: <Monitor color="#6765b1" /> },
    { title: 'Rechtliches & Vertragliches', path: '/company/openings', subTitle: 'Verwalte Deine ', color: 'tertiary' },
    { title: 'Nutzer', path: '/company/user', subTitle: 'Verwalte Deine ', color: 'tertiary' },
    { title: 'Rezensionen', path: '', subTitle: 'Verwalte Deine ', color: 'tertiary' },
    { title: 'Einbettungen', path: '', subTitle: 'Verwalte Deine ', color: 'tertiary' },
    { title: 'Analytics', path: '', subTitle: 'Verwalte Deine ', color: 'tertiary' },
  ],
};

export default companyRoutes;
