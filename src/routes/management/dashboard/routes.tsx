import { IconClock, IconCreditCard, IconCurrencyDollar, IconDeviceDesktopAnalytics, IconDoorEnter, IconEye, IconHome, IconInfoCircle, IconPhoto, IconSelect, IconStar, IconWriting } from '@tabler/icons';
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
  basic: [
    { title: 'Einrichtung', path: '/company/basic', dependency: ['title', 'category'], icon: <IconInfoCircle color="#b9d6fe" /> },
    { title: 'Kontakt', path: '/company/contact', dependency: ['address'], icon: <IconHome color="#fb823b" /> },
    { title: 'Öffnungszeiten', path: '/company/openings', icon: <IconClock color="#3ca7ef" /> },
    { title: 'Spezifisch', path: '/company/specific', icon: <IconStar color="#f571aa" /> },
    { title: 'Bilder', path: '/company/images', icon: <IconPhoto color="#b555dd" /> },
    { title: 'Dokumente', path: '/company/documents', icon: <IconCreditCard color="#fdcd79" /> },
  ],
  reservation: [
    { title: 'Leistungen', path: '/company/services', text: 'Lege deine Leistungen an', icon: <IconSelect color="#25a7ff" /> },
    { title: 'Preise', path: '/company/prices', text: 'Preise hinzufügen und anpassen', icon: <IconCurrencyDollar color="#ff663d" /> },
    { title: 'Verfügbarkeiten', path: '/company/availabilities', text: 'Verfügbarkeiten der Leistungen', icon: <IconDoorEnter color="#c2429f" /> },
    { title: 'Reservierungen', path: '/company/reservations', text: 'Reservierungen einsehen', icon: <IconEye color="#eca975" /> },
    { title: 'Rechtliches & Vertragliches', path: '/company/contract', text: 'Verwalte Deine ', icon: <IconWriting color="#25a7ff" /> },
  ],
  disabled: [
    { title: 'Vorschau', path: '/company/dashboard', text: 'Coming soon', icon: <IconDeviceDesktopAnalytics color="#6765b1" /> },
    { title: 'Rechtliches & Vertragliches', path: '/company/openings', text: 'Verwalte Deine ' },
    { title: 'Nutzer', path: '/company/user', text: 'Verwalte Deine ' },
    { title: 'Rezensionen', path: '', text: 'Verwalte Deine ' },
    { title: 'Einbettungen', path: '', text: 'Verwalte Deine ' },
    { title: 'Analytics', path: '', text: 'Verwalte Deine ' },
  ],
};

export default companyRoutes;
