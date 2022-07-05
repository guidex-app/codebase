import { IconDoorEnter, IconFlag, IconPhoto, IconScubaMask, IconSelect, IconSoccerField, IconUserPlus } from '@tabler/icons';
import { h } from 'preact';

import { Questions } from '../../../interfaces/company';

const ServiceQuestions: Questions[] = [{
  info: {
    title: { name: 'Leistungen', form: 'serviceName' },
    question: 'Welche Art von Leistung möchten sie anbieten?',
    explanation: 'Definieren sie hier die Art Ihrer Leistungsgruppe. Wenn Sie mehrere Optionen vertreten, legen sie diese Einzelnt an.',
    example: 'Wenn sie z.B. ein Abenteuerspielplatz sind und ein Eintritt definieren wollen, wählen sie Eintritt(e) aus. Wenn sie verschieden Räume zur verfügung stellen, wählen sie stattdessen Räume/Bereich(e)',
    advice: 'Wird die Anzahl in Räumen, Objekten oder Eintrittsangeboten definiert',
    icon: <IconFlag color="#ff5613" />,
    type: 'radio',
    availableActivated: false,
    availableText: 'Keine Preis-Unterschiede',
  },
  answers: [
    { icon: <IconDoorEnter color="#63e6e1" />, label: 'Eintritt', name: 'entry', inputType: 'string', info: 'Bitte legen Sie die verschiedenen Eintrittsangebote an. Z.B. Eintritt-Normal und Fast Lane. etc.', onDay: false, placeholder: 'Bitte benennen sie Ihren Eintritt', isMultiField: false },
    { icon: <IconScubaMask color="#d4be21" />, label: 'Verleihobjekt', name: 'object', inputType: 'string', info: 'Bitte legen Sie die verschiedenen Räume/Bahnen/Spiele an, die bei Ihnen gespielt werden können. Selbst wenn diese preislich gleich sind.', placeholder: 'Bitte benennen sie Ihr Verleihobjekt', onDay: false, isMultiField: false },
    { icon: <IconSoccerField color="#bf5bf3" />, label: 'Raum/Bahn/Spiel', name: 'section', inputType: 'string', info: 'Bitte legen Sie die verschiedenen Räume/Bahnen/Spiele an, die bei Ihnen gespielt werden können. Selbst wenn diese preislich gleich sind.', placeholder: 'Bitte benennen sie Ihren Raum/Bahn/Spiel', onDay: false, isMultiField: false },
  ],
},
// {
//   info: {
//     title: { name: 'Leistungen', form: 'serviceNames' },
//     question: 'Leistung benennen.',
//     explanation: 'Tragen sie hier den Namen Ihrer Leistungen ein, welche keine abweichungen in Rabatten, Alter, Tagesrabatten aufweisen. Der Preis zueinander kann abweichen. Es wird ledigtlich die gleiche Logik kombiniert. Wenn eine aktivität z.B. einen Alter, Studenten Rabatt hat und die andere nicht, legen sie diese als eigene Leistungs-Gruppe an. Hier werden nur Leistungen mit gleichen Eigenschaften definiert.',
//     example: 'Diese Escape Rooms haben alle die gleichen Eigenschaften. Achten Sie darauf, dass der Name möglichst kurz und verständlich ist.',
//     advice: 'z.B.: Escape Mystery, Escape Operation, Escape Prison',
//     icon: <Archive color="#0983fe" />,
//     type: 'onType',
//     availableActivated: false,
//     availableText: 'Keine Preis-Unterschiede',
//   },
//   answers: [
//     { icon: <Flag />, label: 'Eintrittspreise', name: 'entry', inputType: 'string', info: 'Bitte legen Sie die verschiedenen Eintrittsangebote an. Z.B. Eintritt-Normal und Fast Lane. etc.', onDay: false, isMultiField: false, placeholder: 'Wie heißt dein Eintrittspreis?' },
//     { icon: <Flag />, label: 'Spiele/Räume/Bahnen', name: 'section', inputType: 'string', info: 'Bitte legen Sie die verschiedenen Räume/Bahnen/Spiele an, die bei Ihnen gespielt werden können. Selbst wenn diese preislich gleich sind.', onDay: false, isMultiField: false, placeholder: 'Wie heißt dein Spiele, Räume oder Bahn?' },
//     { icon: <Flag />, label: 'Verleihobjekte', name: 'object', inputType: 'string', info: 'Bitte legen Sie die verschiedenen Objekte an, die gegen eine Gebühr ausgeliehen werden können.', onDay: false, isMultiField: false, placeholder: 'Wie heißt dein Objekte oder Verleihobjekt?' },
//   ],
// },
{
  info: {
    title: { name: 'Beschreibung', form: 'description' },
    question: 'Beschreibe Deine Leistung',
    explanation: 'Geben Sie Ihren Kunden einen Einblick in die gebotenen Leistungen',
    example: 'z.B. Der Escape Room Mystery entführt dich in eine Welt voller Spannungen. Das Abenteuer basiert auf Mysteriösen Umständen, die dich immer wieder vor neue Herausforderungen stellen. Im Paket ist enthalten ...',
    advice: 'Definieren Sie die wichtigsten Informationen.',
    icon: <IconSelect color="#63e6e1" />,
    type: 'onService',
    availableActivated: false,
    availableText: 'Keine Beschreibung',
  },
  answers: [
    { icon: <IconSelect />, label: 'Beschreibung', name: 'description', inputType: 'textarea', info: '', onDay: false, isMultiField: false, placeholder: 'z.B.: Die Einführung und Schwimmwesten sind im Preis enthalten.' },
  ],
},
{
  info: {
    title: { name: 'Bitte mitbringen', form: 'bringWith' },
    question: 'Was muss mitgebracht werden',
    explanation: 'Für einige Aktivitäten werden bestimmte Dinge benötigt. Bitte definieren sie diese in einem kurzen Text.',
    example: 'z.B. Badehose, Wechselklamotten, Sonnenschutze',
    advice: 'Welche Dinge werden benötigt?',
    icon: <IconUserPlus color="#63e6e1" />,
    type: 'onService',
    availableActivated: false,
    availableText: '',
  },
  answers: [
    { icon: <IconSelect />, label: 'Was muss mitgebracht werden', name: 'bringWith', inputType: 'textarea', info: '', onDay: false, isMultiField: false, placeholder: 'z.B.: Badehose, Wechselklamotten, Sonnenschutze, ...' },
  ],
},
{
  info: {
    title: { name: 'Bild', form: 'image' },
    question: 'Bitte füge ein Bild für die Leistung hinzu',
    explanation: 'Geben Sie Ihren Kunden einen Einblick in die gebotene Leistung.',
    example: 'Ein Bild sagt mehr als tausend Worte, wählen sie daher Bilder, die Ihre Leistung gut veranschaulichen. Die Bilder sollten mind. den maßen 1200x900px entsprechen.',
    advice: 'Wählen sie Helle und kontrastreiche Bilder und achten sie auf eine positive Bildstimmung.',
    icon: <IconPhoto color="#ff375e" />,
    type: 'onService',
    availableActivated: false,
    availableText: 'Keine Bilder',
  },
  answers: [
    { icon: <IconPhoto />, label: 'Bild', name: 'image', inputType: 'image', info: '', onDay: false, isMultiField: false, placeholder: 'z.B.: Die Einführung und Schwimmwesten sind im Preis enthalten.' },
  ],
},
];

// {
//   info: {
//     title: { name: 'Struktur', form: 'structure' },
//     question: 'Möchten sie eine oder mehrere Leistungen mit der gleichen Preis-Struktur anlegen?',
//     explanation: 'Hier definieren Sie Leistungen mit gleicher Preis-Struktur. Sie können eine oder mehrer Leistungen mit gleicher Preis-Struktur gleichzeitig anlegen.',
//     example: 'z.B. bei Escape Rooms, haben sie unterschiedliche Räume, die aber der gleichen Preis-Struktur unterliegen.',
//     advice: 'Sollten Sie mehrere Leistungen mit unterschiedlichen Preis-Strukturen anlegen wollen, müssen Sie diese getrennt angelegt werden.',
//     icon: <Flag />,
//     type: 'simple',
//     availableActivated: false,
//     availableText: 'Keine Preis-Unterschiede',
//   },
//   answers: [
//     { icon: <Flag />, label: 'Eine Leistung', name: 'single', inputType: 'string', info: 'Bitte legen Sie die verschiedenen Eintrittsangebote an. Z.B. Eintritt-Normal und Fast Lane. etc.', onDay: false, isMultiField: false },
//     { icon: <Flag />, label: 'mehrere Leistungen', name: 'multi', inputType: 'string', info: 'Bitte legen Sie die verschiedenen Räume/Bahnen/Spiele an, die bei Ihnen gespielt werden können. Selbst wenn diese preislich gleich sind.', onDay: false, isMultiField: false },
//   ],
// },

export default ServiceQuestions;
