import { h } from 'preact';
import { Archive, Clock, Columns, CreditCard, DollarSign, Home, Image, Info, Monitor, Star } from 'react-feather';

export interface Pages {
    title: string,
    text?: string,
    path: string,
        dependency?: string[]
    routerDirection?: string,
    icon?: any,
  }

const companyRoutes: { [key: string]: Pages[] } = {
  basic: [
    { title: 'Einrichtung', path: '/company/basic', dependency: ['title', 'category'], icon: <Info color="#b9d6fe" /> },
    { title: 'Kontakt', path: '/company/contact', dependency: ['address'], icon: <Home color="#fb823b" /> },
    { title: 'Öffnungszeiten', path: '/company/openings', icon: <Clock color="#3ca7ef" /> },
    { title: 'Spezifisch', path: '/company/specific', icon: <Star color="#f571aa" /> },
    { title: 'Bilder', path: '/company/images', icon: <Image color="#b555dd" /> },
    { title: 'Dokumente', path: '/company/documents', icon: <CreditCard color="#fdcd79" /> },
  ],
  reservation: [
    { title: 'Leistungen', path: '/company/services', text: 'Lege deine Leistungen an', icon: <Archive color="#25a7ff" /> },
    { title: 'Preis-Tabellen', path: '/company/prices', text: 'Preise hinzufügen und anpassen', icon: <DollarSign color="#ff663d" /> },
    { title: 'Verfügbarkeiten', path: '/company/availabilities', text: 'Verfügbarkeiten der Leistungen', icon: <Columns color="#c2429f" /> },
    { title: 'Reservierungen', path: '/company/reservations', text: 'Reservierungen einsehen', icon: <Columns color="#eca975" /> },
    { title: 'Rechtliches & Vertragliches', path: '/company/contract', text: 'Verwalte Deine ', icon: <Archive color="#25a7ff" /> },
  ],
  disabled: [
    { title: 'Vorschau', path: '/company/dashboard', text: 'Coming soon', icon: <Monitor color="#6765b1" /> },
    { title: 'Rechtliches & Vertragliches', path: '/company/openings', text: 'Verwalte Deine ' },
    { title: 'Nutzer', path: '/company/user', text: 'Verwalte Deine ' },
    { title: 'Rezensionen', path: '', text: 'Verwalte Deine ' },
    { title: 'Einbettungen', path: '', text: 'Verwalte Deine ' },
    { title: 'Analytics', path: '', text: 'Verwalte Deine ' },
  ],
};

export default companyRoutes;
