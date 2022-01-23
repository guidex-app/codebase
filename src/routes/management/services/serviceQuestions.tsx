import { h } from 'preact';
import { Flag, Archive, UserPlus, Type, Image } from 'react-feather';
import { Questions } from '../../../interfaces/company';

const ServiceQuestions: Questions[] = [{
  info: {
    title: { name: 'Typ', form: 'serviceType' },
    question: 'Welche Art Leistung definieren sie?',
    explanation: 'Definieren sie hier die Art Ihrer Leistungsgruppe. Wenn Sie mehrere Optionen vertreten, legen sie diese Einzelnt an.',
    example: 'Wenn sie z.B. ein Abenteuerspielplatz sind und ein Eintritt definieren wollen, wählen sie Eintritt(e) aus. Wenn sie verschieden Räume zur verfügung stellen, wählen sie stattdessen Räume/Bereich(e)',
    advice: 'Wird die Anzahl in Räumen, Objekten oder Eintrittsangeboten definiert',
    icon: <Flag color="#ff5613" />,
    type: 'simple',
    availableActivated: false,
    availableText: 'Keine Preis-Unterschiede',
  },
  answers: [
    { icon: <Flag />, label: 'Eintritt', name: 'entry', inputType: 'text', info: 'Bitte legen Sie die verschiedenen Eintrittsangebote an. Z.B. Eintritt-Normal und Fast Lane. etc.', onDay: false, isMultiField: false },
    { icon: <Flag />, label: 'Verleihobjekt', name: 'object', inputType: 'text', info: 'Bitte legen Sie die verschiedenen Räume/Bahnen/Spiele an, die bei Ihnen gespielt werden können. Selbst wenn diese preislich gleich sind.', onDay: false, isMultiField: false },
    { icon: <Flag />, label: 'Raum/Bereich', name: 'roundGames', inputType: 'text', info: 'Bitte legen Sie die verschiedenen Räume/Bahnen/Spiele an, die bei Ihnen gespielt werden können. Selbst wenn diese preislich gleich sind.', onDay: false, isMultiField: false },
  ],
},
{
  info: {
    title: { name: 'Leistungen', form: 'serviceNames' },
    question: 'Leistungen kombinieren und benennen.',
    explanation: 'Tragen sie hier die Namen Ihrer Leistungen ein, welche keine abweichungen in Rabatten, Alter, Tagesrabatten aufweisen. Der Preis zueinander kann abweichen. Es wird ledigtlich die gleiche Logik kombiniert. Wenn eine aktivität z.B. einen Alter, Studenten Rabatt hat und die andere nicht, legen sie diese als eigene Leistungs-Gruppe an. Hier werden nur Leistungen mit gleichen Eigenschaften definiert.',
    example: 'Diese Escape Rooms haben alle die gleichen Eigenschaften. Achten Sie darauf, dass der Name möglichst kurz und verständlich ist.',
    advice: 'z.B.: Escape Mystery, Escape Operation, Escape Prison',
    icon: <Archive color="#0983fe" />,
    type: 'onType',
    availableActivated: false,
    availableText: 'Keine Preis-Unterschiede',
  },
  answers: [
    { icon: <Flag />, label: 'Eintrittspreise', name: 'entry', inputType: 'text', info: 'Bitte legen Sie die verschiedenen Eintrittsangebote an. Z.B. Eintritt-Normal und Fast Lane. etc.', onDay: false, isMultiField: false, placeholder: 'Wie heißt dein Eintrittspreis?' },
    { icon: <Flag />, label: 'Spiele/Räume/Bahnen', name: 'roundGames', inputType: 'text', info: 'Bitte legen Sie die verschiedenen Räume/Bahnen/Spiele an, die bei Ihnen gespielt werden können. Selbst wenn diese preislich gleich sind.', onDay: false, isMultiField: false, placeholder: 'Wie heißt dein Spiele, Räume oder Bahn?' },
    { icon: <Flag />, label: 'Verleihobjekte', name: 'object', inputType: 'text', info: 'Bitte legen Sie die verschiedenen Objekte an, die gegen eine Gebühr ausgeliehen werden können.', onDay: false, isMultiField: false, placeholder: 'Wie heißt dein Objekte oder Verleihobjekt?' },
  ],
},
{
  info: {
    title: { name: 'Beschreibung', form: 'descriptions' },
    question: 'Bitte beschreiben Sie kurz Ihre angelegten Leistungen',
    explanation: 'Geben Sie Ihren Kunden einen Einblick in die gebotenen Leistungen',
    example: 'z.B. Der Escape Room Mystery entführt dich in eine Welt voller Spannungen. Das Abenteuer basiert auf Mysteriösen Umständen, die dich immer wieder vor neue Herausforderungen stellen. Im Paket ist enthalten ...',
    advice: 'Definieren Sie die wichtigsten Informationen.',
    icon: <Type color="#63e6e1" />,
    type: 'onService',
    availableActivated: false,
    availableText: 'Keine Beschreibung',
  },
  answers: [
    { icon: <Flag />, label: 'Beschreibung', name: 'descriptions', inputType: 'textarea', info: 'Beschreiben Sie die Besonderheiten Ihrer Leistungen', onDay: false, isMultiField: false, placeholder: 'z.B.: Die Einführung und Schwimmwesten sind im Preis enthalten.' },
  ],
},
{
  info: {
    title: { name: 'Bitte mitbringen', form: 'bringWith' },
    question: 'Was sollen Nutzer mitbringen?',
    explanation: 'Für einige Aktivitäten werden bestimmte Dinge benötigt. Bitte definieren sie diese in einem kurzen Text.',
    example: 'z.B. Badehose, Wechselklamotten, Sonnenschutze',
    advice: 'Welche Dinge werden benötigt?',
    icon: <UserPlus color="#63e6e1" />,
    type: 'onService',
    availableActivated: false,
    availableText: '',
  },
  answers: [
    { icon: <Flag />, label: 'Beschreibung', name: 'bringWith', inputType: 'textarea', info: 'Was sollen Nutzer mitbringen?', onDay: false, isMultiField: false, placeholder: 'z.B.: Badehose, Wechselklamotten, Sonnenschutze, ...' },
  ],
},
{
  info: {
    title: { name: 'Bilder', form: 'images' },
    question: 'Bitte fügen sie Ihren Leistungen jeweils ein Bild hinzu',
    explanation: 'Geben Sie Ihren Kunden einen Einblick in die gebotenen Leistungen.',
    example: 'Ein Bild sagt mehr als tausend Worte, wählen sie daher Bilder, die Ihre Leistung gut veranschaulichen. Die Bilder sollten mind. den maßen 1200x900px entsprechen.',
    advice: 'Wählen sie Helle und kontrastreiche Bilder und achten sie auf eine positive Bildstimmung.',
    icon: <Image color="#ff375e" />,
    type: 'onService',
    availableActivated: false,
    availableText: 'Keine Beschreibung',
  },
  answers: [
    { icon: <Flag />, label: 'Bild', name: 'images', inputType: 'image', info: 'Beschreiben Sie die Besonderheiten Ihrer Leistungen', onDay: false, isMultiField: false, placeholder: 'z.B.: Die Einführung und Schwimmwesten sind im Preis enthalten.' },
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
//     { icon: <Flag />, label: 'Eine Leistung', name: 'single', inputType: 'text', info: 'Bitte legen Sie die verschiedenen Eintrittsangebote an. Z.B. Eintritt-Normal und Fast Lane. etc.', onDay: false, isMultiField: false },
//     { icon: <Flag />, label: 'mehrere Leistungen', name: 'multi', inputType: 'text', info: 'Bitte legen Sie die verschiedenen Räume/Bahnen/Spiele an, die bei Ihnen gespielt werden können. Selbst wenn diese preislich gleich sind.', onDay: false, isMultiField: false },
//   ],
// },

export default ServiceQuestions;
