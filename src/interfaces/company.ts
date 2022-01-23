import { Activity } from './activity';

export interface CompState {
  activity: Activity,
  loading: boolean;
}

/**
 * Service Interface, mit allen benötigten Infos zum Service
 */
export interface ServiceInfo {
  id?: string;
  serviceType?: 'entry' | 'roundGames' | 'object';
  serviceNames?: string[];
  structure?: string[],
  descriptions?: string[];
  images?: string[];

}

/**
 * Answers sind den Fields untergeordnete antworten
 */
export interface AnsDB {
  name: string,
  amountOfFields: string,
  isRound?: boolean[],
  onDays?: (string | undefined)[], // auf den Value Index spezifizierte Tage
  values?: any[];
}

/**
 * ServiceFields sind dem Service untergeordnete gruppierungen
 */
export interface ServiceField {
  name: string;
  notIsChecked?: boolean;
  answers?: AnsDB[];
  onDays?: string[];
}

/**
 * TYPES
 * "simple" = wenn es einfache radio checks sind ohne weitere values;
 * "onType" = wenn es auf den Types basiert
 */
export interface Infos {
  title: { name: string, form: string }, question: string, explanation: string, example: string, advice: string, icon: any, type: 'radio' | 'checkbox' | 'onType' | 'onService' | 'onOpenings' | 'simple', availableText: string, availableActivated: boolean
}

export interface AnsInfo {
  label: string,
  name: string,
  icon: any,
  inputType: ('text' | 'dayPicker' | 'number' | 'time' | 'textarea' | 'image'),
  info: string,
  onDay: boolean,
  isMultiField: boolean,
  placeholder?: string
}

export interface Questions {
  info: Infos;
  answers: AnsInfo[];
}
