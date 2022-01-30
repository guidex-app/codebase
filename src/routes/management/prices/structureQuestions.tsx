import { h } from 'preact';
import { Calendar, Users, Clock, Settings, Star, UserPlus } from 'react-feather';
import { Questions } from '../../../interfaces/company';

const StructureQuestions: Questions[] = [
  {
    info: {
      title: { name: 'Tagesgruppen', form: 'days' },
      question: 'Unterscheiden sich die Preise an bestimmten Tagen?',
      explanation: 'Variieren bei Ihnen die Preise Tagesabhängig bei folgenden Faktoren? Preis (im Allgemeinen), Alter der Person (Kind etc.), Uhrzeiten (von bis), Dauer (1h, 2h etc.), Preis nach Rundenzahl, Gruppenpreise, Rabatte für Mitglieder oder Bevölkerungsschichten.',
      example: 'z.B. Am Wochenende sind die Preise höher, als in der Woche. Dafür müssen Sie 2 Tagesgruppen erstellen. Gruppe 1 (Mo, Di, Mi, Do, Fr) und Gruppe 2 (Sa, So)',
      advice: 'Achtung: Die Tagesgruppen sind entscheident in allen darauf folgenden Fragen.',
      icon: <Calendar />,
      type: 'onOpenings',
      availableActivated: true,
      availableText: 'Die Preise sind jeden Tag gleich',
    },
    answers: [
      { icon: <Calendar />, label: 'Die Preise sind Tagesabhängig', name: 'day', inputType: 'dayPicker', info: 'Bitte geben Sie die sog. Tagesgruppen an. Sprich, sollten die Preise an bestimmten Tagen gleich sein bilden diese eine Gruppe. Wenn jedoch die Preise an jedem Tag variieren legen Sie 7 Gruppen mit jeweils 1 Tag an. Die Tage in den jeweiligen Tagesgruppen werden von unserem System komplett gleich behandelt.', onDay: false, isMultiField: false },
    ],
  },
  {
    info: {
      title: { name: 'Alter', form: 'age' },
      question: 'Gibt es Preisunterschiede zwischen bestimmten Altersgruppen?',
      explanation: 'Hier wird definiert, ob der Preis unabhängig vom Alter ist oder dieser zwischen verschiedenen Altersgruppen variiert. Zusätzlich gibt es noch die Möglichkeit, dass die altersabhängigen Preise an jedem Tag oder nur an bestimmten Tagen gültig sind.',
      example: 'z.B. Kinder im Alter von 6 -14 Jahren bekommen einen günstigeren Preis.',
      advice: 'Hinweis: Die Option nach Tagesgruppen zu unterscheiden wird nur angezeigt, wenn diese im vorherigen Schritt definiert wurden.',
      icon: <Users />,
      type: 'radio',
      availableActivated: true,
      availableText: 'Der Preis ist für alle Altersgruppen gleich',
    },
    answers: [
      { icon: <Calendar />, label: 'Der Preis variiert bei bestimmten Altersgruppen', name: 'age', inputType: 'number', info: 'Bitte geben Sie an, ob die Preise sich je nach Alter der Person verändern', onDay: false, isMultiField: true, placeholder: 'Von: 6 (Jahre) / Bis: 14 (Jahre)' },
      { icon: <Calendar />, label: 'Nur an bestimmten Tagen varriiert der Preis, je nach Alter.', name: 'onDayAge', inputType: 'number', info: 'An welchen Tagen gilt ein anderer Preis für bestimmte Altersgruppen?', onDay: true, isMultiField: true, placeholder: 'Bis: 6 (Jahre)" / Bis: 14 (Jahre)' },
    ],
  },
  {
    info: {
      title: { name: 'Uhrzeit', form: 'time' },
      question: 'Unterscheiden sich die Preise zu bestimmten Uhrzeiten?',
      explanation: 'Hier geht es darum, ob sich die Preise zu bestimmten Uhrzeiten unterscheiden. Viele Unternehmen nutzen dieses Prinzip oft an Wochenenden, dafür besteht unten die Möglichkeit anhand der Tagesgruppen die Uhrzeiten zu definieren.',
      example: 'z.B.: Von Montag bis Freitag zwischen 14 - 17 Uhr ist es günstiger als nach 17 Uhr in der Woche und allgemein am Wochenende oder.',
      advice: 'Hinweis: Tagesabhängige Uhrzeiten können nur definiert werden, wenn diese in den vorherigen Tages angaben definiert wurden.',
      icon: <Clock />,
      type: 'radio',
      availableActivated: true,
      availableText: 'Die Preise variieren nicht abhängig von der Uhrzeit',
    },
    answers: [
      { icon: <Calendar />, label: 'Die Preise variieren bei folgenden Uhrzeiten.', name: 'time', inputType: 'time', info: 'Hier geht es darum, ob sich die Preise je nach Uhrzeit verändern z.B. 14 Uhr bis 17:00 Uhr, 18:00-22:00 etc.', onDay: false, isMultiField: true, placeholder: 'z.B.: 14:00 Uhr / z.B.: 17:00 Uhr' },
      { icon: <Calendar />, label: 'An diesen Tagesgruppen variiert der Preis zu folgenden Uhrzeiten.', name: 'onDayTime', inputType: 'time', info: 'Hier geht es darum, ob sich die Preise nur an bestimmten Tagen je nach Uhrzeit verändern.', onDay: true, isMultiField: true, placeholder: 'z.B.: 14:00 Uhr / z.B.: 17:00 Uhr' },
    ],
  },
  {
    info: {
      title: { name: 'Preis Grundlage', form: 'foundation' },
      question: 'Definiere, ob der Preis pro Person oder pro Gegenstand/Raum berechnet wird?',
      explanation: 'Ist der Preis unabhängig vom Alter, oder variiert dieser? Gibt es den altersabhängigen Preis an jedem Tag oder nur an bestimmten Tagen?',
      example: 'z.B. Bei Bowlingbahnen zahlt man pro Bahn und nicht pro Pers.',
      advice: '',
      icon: <Settings />,
      type: 'simple',
      availableActivated: false,
      availableText: 'Der Preis wird pro Person berechnet',
    },
    answers: [
      { icon: <Calendar />, label: 'Der Preis wird pro Person berechnet', name: 'persPrice', inputType: 'number', info: '', onDay: false, isMultiField: false, placeholder: '' },
      { icon: <Calendar />, label: 'Der Preis wird anhand eines Gegenstandes/Raum/Bahn berechnet', name: 'objectPrice', inputType: 'number', info: '', onDay: false, isMultiField: false, placeholder: '' },
      { icon: <Calendar />, label: 'Der Preis wird Tagesabhängig anhand eines Gegenstandes/Raum/Bahn oder Person berechnet', name: 'onDayObject', inputType: 'number', info: '', onDay: true, isMultiField: false, placeholder: '' },
    ],
  },
  {
    info: {
      title: { name: 'Dauer & Rundendauer', form: 'duration' },
      question: 'Berechnet sich der Preis anhand der Dauer oder pro Runde/Spiel?',
      explanation: 'Hier gilt es zu definieren, ob sich der Preis anhand der Dauer oder pro Runde berechnet. Zudem muss definiert werden welche Dauer angeboten wird und/oder wie lange eine durchschnittliche Runde dauert. Wenn Sie in der Woche anhand der Dauer berechnen und am Wochenende pro Spiel, sprich eine Tagesabhängigkeit besteht wählen Sie die zweite Option.',
      example: 'z.B. In manchen Bowlingcenters wird in der Woche pro Spiel und am Wochenende pro Stunde abgerechnet.',
      advice: 'Hinweis: Wenn sie an bestimmten Tagen feste Zeiten haben und an anderen feste Rundenzeiten, wählen sie den letzten Punkt.',
      icon: <Clock />,
      type: 'checkbox',
      availableActivated: false,
      availableText: '',
    },
    answers: [
      { icon: <Calendar />, label: 'Dauer wird anhand fester Zeiten definiert', name: 'durationTime', inputType: 'number', info: 'Bitte geben Sie die reservierbaren Dauern ein z.B. 60 Minuten, 90 etc. ', onDay: false, isMultiField: false, placeholder: 'z.B.: 60 Min.' },
      { icon: <Calendar />, label: 'Dauer wird anhand von Runden definiert', name: 'durationRound', inputType: 'number', info: 'Geben deinen Runden eine durchschnittliche Rundenzeit an.', onDay: false, isMultiField: false, placeholder: 'Die Runde dauert z.B.: 60 Min.' },
      { icon: <Calendar />, label: 'An folgenden Tagen gibt es feste Zeiten', name: 'onDayDurationTime', inputType: 'number', info: 'Bitte geben Sie die reservierbaren Dauern ein z.B. 60 Minuten, 90 etc.', onDay: true, isMultiField: false, placeholder: 'z.B.: 60 Min.' },
      { icon: <Calendar />, label: 'An folgenden Tagen gibt es Runden', name: 'onDayDuration', inputType: 'number', info: 'Geben deinen Runden eine durchschnittliche Rundenzeit an.', onDay: true, isMultiField: false, placeholder: 'z.B.: 60 Min.' },
    //   { icon: calendar, label: 'Es gibt verschiedene Dauern oder Rundendauern.', name: 'dauer', inputType: 'number', info: 'Bitte geben Sie die reservierbaren Dauern ein z.B. 60 Min.', onDay: false, isMultiField: false, placeholder: 'z.B.: 60 Min.' },
    //   { icon: calendar, label: 'Die Dauern oder Runden sind Tagesabhängig', name: 'dauerGroup', inputType: 'number', info: 'Bitte geben Sie die reservierbaren Dauern ein z.B. 60 Min.', onDay: true, isMultiField: false, placeholder: 'z.B.: 60 Min.' },
    ],
  },
  {
    info: {
      title: { name: 'Runden Rabatte', form: 'roundDiscount' },
      question: 'Wie verändert sich der Preis je nach Runden/Spiel Anzahl?',
      explanation: 'Viele Unternehmen bieten ab einer bestimmten Anzahl an Runden/Spielen unterschiedliche Preise an. Sprich, der Preis pro Runde ist günstiger bei 5 Runden, als bei 4 Runden. Legen Sie dafür die Rundenanzahlen an, bei denen ein besonderer Preis gilt. Zudem kann der Runden-preis ja auch am Wochenende höher sein, als in der Woche oder Runden-vergünstigungen entfallen möglicherweise an bestimmten Tagen. - Dafür nutzen Sie bitte die dritte Option und ordnen die vergünstigten Rundenanzahlen den Tagesgruppen zu.',
      example: 'z.B. Montags und Mittwochs sind 5 Runden im Voraus reserviert pro Runde günstiger, als 4 Runden einzeln nacheinander gespielt.',
      advice: '',
      icon: <Star />,
      type: 'radio',
      availableActivated: true,
      availableText: 'Der Preis pro Runde/Spiel ist unabhängig von der Rundenanzahl.',
    },
    answers: [
      { icon: <Calendar />, label: 'Der Preis verändert sich ab folgender Rundenzahl', name: 'roundDiscount', inputType: 'number', info: 'Hier definieren Sie die unterschiedlichen reservierbaren Rundenanzahlen.', onDay: false, isMultiField: false, placeholder: 'z.B.: 3 Runden an' },
      { icon: <Calendar />, label: 'Nur an bestimmten Tagen variiert der Preis, je nach Rundenanzahl.', name: 'onDayRoundDiscount', inputType: 'number', info: 'Bitte geben Sie die Rundenanzahlen an, bei denen es einen veränderten Preis gibt.', onDay: true, isMultiField: false, placeholder: 'z.B.: 3 Runden' },
    ],
  },
  {
    info: {
      title: { name: 'Personen', form: 'persons' },
      question: 'Gibt es Gruppenpreise bzw. variiert der Preis je nach Personenanzahl?',
      explanation: 'Hier wird angegeben, ob sich der Preis pro Person je nach Personenanzahl verändert. Sprich, ob es eine Art Rabatt gibt bzw. es günstiger wird, wenn man die Leistung mit einer bestimmten Anzahl an Personen in Anspruch nimmt. Sollte es Gruppenpreise nur an bestimmten Tagen geben, kann dies unter der dritten Option angegeben werden.',
      example: 'z.B. Der Preis pro Person ist bei einer Gruppe von 4 Personen günstiger, als bei 4 einzelnen Personen.',
      advice: 'Die Personen-Rabatt Anzahl darf nicht über der Raum-Kapazität liegen (Siehe Verfügbarkeiten)',
      icon: <UserPlus />,
      type: 'radio',
      availableActivated: true,
      availableText: 'Die Personenanzahl hat keinen Einfluss auf den Preis',
    },
    answers: [
      { icon: <Calendar />, label: 'Bei folgender Personenanzahl gelten unterschiedliche Preise (pro Person)', name: 'person', inputType: 'number', info: 'Bitte geben Sie an für welche Personenanzahlen sich der Preis pro Person verändert z.B. 2 Personen, 4 Personen usw.', onDay: false, isMultiField: false, placeholder: 'z.B.: 10 Personen' },
      { icon: <Calendar />, label: 'Bei folgender Personenanzahl gelten Gruppenpreise (Gruppenpreis)', name: 'group', inputType: 'number', info: 'Bitte geben Sie an für welche Gruppengröße andere Preise gelten z.B. 10 Personen, 20 Personen usw.', onDay: false, isMultiField: false, placeholder: 'z.B.: 20 Personen' },
      { icon: <Calendar />, label: 'Personenanzahl gelten nur an folgenden Tagen (pro Person)', name: 'personGroup', inputType: 'number', info: 'Bitte definieren Sie, an welchen Tagen sich der Preis pro Person verändert', onDay: true, isMultiField: false, placeholder: 'z.B.: 10 Personen' },
      { icon: <Calendar />, label: 'Nur an folgenden Tagen gibt es Gruppenpreise.', name: 'onDayGroup', inputType: 'number', info: 'Bitte definieren Sie, an welchen Tagen Gruppenpreise gelten', onDay: true, isMultiField: false, placeholder: 'z.B.: 20 Personen' },
    ],
  },
  {
    info: {
      title: { name: 'Rabatte', form: 'discounts' },
      question: 'Gelten für bestimmte Bevölkerungsgruppen / Berufsgruppen oder Mitgliedschaften andere Preise?',
      explanation: 'Einige Unternehmen haben besondere Preise für bestimmte Bevölkerungs- /Berufsgruppen und für Mitglieder bei bestimmten Vereinen etc. Zudem können diese auch nur an bestimmten Tagen in der Woche gelten. Um die Tage/Tagesgruppen an denen besondere Preise für XY gelten auszuwählen, nutzen Sie die dritte Option.',
      example: 'z.B.: Schüler, Auszubildende, Studenten, Senioren bekommen ermäßigte Preise',
      advice: 'Hinweis: Die dritte Option steht Ihnen nur zur Verfügung, wenn Sie bei der ersten Frage Tagesgruppen festgelegt haben.',
      icon: <Star />,
      type: 'radio',
      availableActivated: true,
      availableText: 'Wir bieten keine derartigen Rabatte.',
    },
    answers: [
      { icon: <Calendar />, label: 'Veränderte Preise gibt es für ...', name: 'discount', inputType: 'text', info: 'Bitte definieren sie für wen es Rabatte gibt. Für jede Gruppe muss ein weiterer Rabatt hinzugefügt werden. Es sei denn die Höhe des Rabattes ist gleich', onDay: false, isMultiField: false, placeholder: 'z.B.: Studenten' },
      { icon: <Calendar />, label: 'Nur an bestimmten Tagen varriiert der Preis, je nach Zugehörigkeit.', name: 'onDayDiscount', inputType: 'text', info: 'Bitte definieren sie an welchen Tages es für wen Rabatte gibt. Für jede Gruppe muss ein weiterer Rabatt hinzugefügt werden. Es sei denn die Höhe des Rabattes ist gleich', onDay: true, isMultiField: false, placeholder: 'z.B.: Studenten' },
    ],
  },
];

export default StructureQuestions;
