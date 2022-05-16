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
  serviceType?: 'entry' | 'section' | 'object';
  serviceName?: string;
  structure?: string[],
  description?: string;
  image?: string;
  structureID: number;
}

export interface Structure {
  id?: number;
  services?: string[];
  description?: string;

  foundation?: 'object' | 'person';
  duration?: 'round' | 'fixed';
}

/**
 * Answers sind den Fields untergeordnete antworten
 */
export interface Selected {
  name: string,
  amountOfFields: string,
  values?: { value: any; onDays?: string[]; option?: string; isRound?: boolean; }[];
}

/**
 * ServiceFields sind dem Service untergeordnete gruppierungen
 */
export interface ServiceField {
  name: string;
  // notIsChecked?: boolean;
  selected?: Selected;
}

/**
 * TYPES
 * "simple" = wenn es einfache radio checks sind ohne weitere values;
 * "onType" = wenn es auf den Types basiert
 */
export interface Infos {
  title: { name: string, form: string }, question: string, explanation: string, example: string, advice: string, icon: any, type: 'radio' | 'checkbox' | 'onService' | 'onOpenings' | 'simple', availableText: string, availableActivated: boolean
}

export interface AnsInfo {
  label: string,
  name: string,
  icon: any,
  inputType: ('text' | 'dayPicker' | 'number' | 'time' | 'textarea' | 'image'),
  info: string,
  onDay: boolean,
  isMultiField: boolean,
  options?: string[], // options felder
  placeholder?: string
}

// QUESTION INFOS
export interface Questions {
  info: Infos;
  answers: AnsInfo[];
}
