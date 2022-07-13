/* eslint-disable no-nested-ternary */
import { IconInfoCircle } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { AnsInfo, Questions, Selected, ServiceField, ServiceInfo } from '../../../interfaces/company';
import Chip from '../../chip';
import Item from '../../item';
import TopButton from '../../topButton';
import AddRemove from '../addRemove';
import FormButton from '../basicButton';
import CheckInput from '../checkInput';
import ImgInput from '../imgInput';
import InfoBox from '../infoBox/infoBox';
import NormalInput from '../Inputs/basic';
import MultiInput from '../Inputs/multi';
import TextInput from '../Inputs/textArea';
import OptionInput from '../optionInput';
import DayValue from './dayValue';
import Overview from './overview';
import style from './style.module.css';

interface QuestFormProps {
    questions: Questions[]; // Fragen
    serviceFields?: ServiceField[]; // Antworten des Service
    service?: ServiceInfo; // Serviceinfo oder noch nicht definiert
    folderPath?: string; // folderpath für image uploads
    openingDays?: string[];
    // structure?: any;
    save: (data: ServiceField) => void; // Speicherfunktion
}

const QuestForm: FunctionalComponent<QuestFormProps> = ({ questions, service, openingDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'], serviceFields, folderPath, save }: QuestFormProps) => {
  const [question, setQuestion] = useState<Questions | undefined>();
  const [field, setField] = useState<ServiceField | undefined>();
  const [validation, setValidation] = useState<'valid' | 'notValid'>('notValid');
  const [showOverview, setShowOverview] = useState(false);

  // speichert die aktuelle frage und antworten
  const nextQuestion = () => { if (field && validation === 'valid') save(field); };
  const skip = () => { if (question && question.info.availableActivated) save({ name: question.info.title.form }); };

  /**
   * Findet den nächsten Index in den Fragen (Questions)
   * -2 öffnet das Auswahlfeld
   * */
  const findNextQuestionIndex = (): number => {
    if (questions.length === serviceFields?.length && !question) return -2; // öffnet auswahlfeld
    const current = questions.findIndex((q) => question?.info.title.form === q.info.title.form); // nächste frage
    if (current === -1) return (serviceFields?.length || 0);
    return current > -1 ? current + 1 : 0;
  };

  /** Setzt eine neue Frage, abhängig des "NextQuestionIndexes" */
  const getQuestion = (index?: number) => {
    const nextIndex: number = index !== undefined ? index : findNextQuestionIndex();
    if (nextIndex === -2) return setShowOverview(true);
    const nextForm: string = questions[nextIndex].info.title.form;

    setQuestion(questions[nextIndex]);
    setField(serviceFields?.find((f) => f.name === nextForm) || { name: nextForm });
    if (showOverview) setShowOverview(false);
  };

  /**
   * Validierung aller Felder
   * (Answers werden durchlaufen und wenn ein fehler entdeckt wird (true),
   * dann wird die every schleife abgebrochen (false) und "notValid zurückgegeben")
  */
  const validateField = () => {
    // console.log(question?.info.availableActivated ? 'valid' : 'notValid', field?.selected);
    if (!field?.selected) return setValidation(question?.info.availableActivated ? 'valid' : 'notValid');

    if (question?.info.type === 'simple' && !field?.selected?.name.startsWith('onDay')) return setValidation('valid');

    const checkRoundsSingle: boolean = field.selected.name === 'round' && (field.selected.values?.reduce((total, x) => (x.option === 'dauer_pro_runde' ? total + 1 : total), 0) || 0) > 1;
    console.log('ALLE', field.selected.values);

    const dayValues: boolean = field.selected.name.startsWith('onDay') && !!field.selected.values?.some((x) => !x?.onDays?.[0]);
    const checkFoundation: boolean = field.selected.name === 'onDayObject' && !field.selected.values?.[0].onDays?.[0];
    const checkOnService: boolean = question?.info.type === 'onService' && (!service?.serviceName || !field.selected.values?.every((x) => !!x.value));
    const checkTime: boolean = question?.info.title.form === 'time' && !!field.selected.values?.some((x: any, xIndx: number) => {
      const isDay: string[] | undefined = field?.selected?.name !== 'time' ? x.onDays : undefined;

      const time: string[] | undefined = x.value?.split('-');
      return !time || !field.selected?.values?.every((d, dIndx: number) => {
        if (xIndx === dIndx) return true; // beim gleichen index kein fehler
        if (isDay && d.onDays?.every((day: string) => !isDay.includes(day))) return true;
        return d.value?.indexOf(time[0]) === -1 && d.value?.indexOf(time[1]) === -1;
      });
    });
    const checkAmountOfFields: boolean = question?.info.type !== 'simple' && (field.selected.values?.length !== (field.selected.amountOfFields?.split(',') || ['1'])?.length);
    const checkOptionField: boolean = !!question?.answers.find((x) => field.selected?.name === x.name)?.options?.[0] && !field.selected.values?.every((x) => !!x.option);
    const checkIsMulti: boolean = question?.info.type !== 'simple' && field.selected?.values?.findIndex((sub) => !sub.value || sub.value.toString().startsWith('-') || sub.value.toString().endsWith('-')) !== -1;
    const checkDuration: boolean = field.selected.name === 'onDayDuration' && openingDays.some((x: string) => {
      const count = { rundenpreis: 0, feste_dauer: 0 };
      field.selected?.values?.forEach((val) => val?.onDays?.forEach((days) => {
        if (days === x) {
          if (val.option === 'dauer_pro_runde') {
            count.rundenpreis += 1;
          } else {
            count.feste_dauer += 1;
          }
        }
      }));
      return (count.rundenpreis === 0 && count.feste_dauer === 0) || count.rundenpreis > 1 || (count.rundenpreis > 0 && count.feste_dauer > 0);
    });

    const isInvalid = checkAmountOfFields || checkIsMulti || checkOnService || dayValues || checkOptionField || checkDuration || checkRoundsSingle || checkFoundation || checkTime;

    console.log({ checkAmountOfFields, checkTime, checkIsMulti, checkOnService, dayValues, checkOptionField, checkDuration, checkFoundation });
    return setValidation(isInvalid ? 'notValid' : 'valid');
  };

  const toggleOverview = () => {
    if (showOverview && !question) getQuestion(0);
    setShowOverview(!showOverview);
  };

  useEffect(() => { validateField(); }, [field]); // new value validation
  useEffect(() => { getQuestion(); }, [serviceFields]); // init and new questions

  if (showOverview) return <Overview fields={serviceFields?.map((x) => x.name)} close={toggleOverview} questions={questions} select={getQuestion} />;
  if (!question) return <div />;

  /** togglen einer checkbox */
  const toggle = (value: boolean, name: string) => {
    let selected: Selected | undefined; // default is undefined
    const amountOfFields = name === 'onDayDuration' ? '1,2' : '1';

    if (value) { // checked
      selected = { amountOfFields, name };
      // ...(name === 'onDaysDuration' && structure?.days && { onDays: structure.days })
    }

    setField({ name: question.info.title.form, ...(selected ? { selected } : {}) });
  };

  // const isNot = () => setField({ name: question.info.title.form, notIsChecked: true });

  /** Anzahl der Felder verändern. Bei "remove" wird der letzte Wert auch entfernt */
  const extraField = (type: 'remove' | 'add', answerForm: string) => {
    const selected: Selected | undefined = field?.selected;
    if (!selected) return;

    const amount: string[] = selected?.amountOfFields?.split(',') || ['1'];

    if (type === 'add') {
      amount.push((amount.length + 1).toString());
    } else {
      if (selected.name === 'onDayDuration' && amount.length === 2) return;

      selected?.values?.splice(amount.length - 1);
      amount.pop();
    }

    const newSelected: Selected = { ...selected, name: answerForm, amountOfFields: amount.toString() };
    setField({ name: question.info.title.form, selected: newSelected });
  };

  /** Setzt neue Werte */
  const setNewValue = (value: any, key: string, option?: string) => {
    const selected: Selected | undefined = field?.selected;

    const [name, valuePosition]: string[] = key.split('+');

    const amount: string[] = selected?.amountOfFields?.split(',') || ['1'];

    const newValues: any = amount.map((val: string, valIndex: number) => (
      valIndex === +valuePosition ? { ...selected?.values?.[valIndex], value, ...(option ? { option } : {}) } : selected?.values?.[valIndex] || { value: undefined }
    ));

    const newSelected: Selected = { ...selected, name, amountOfFields: amount.toString(), values: [...newValues] };

    setField({ name: question.info.title.form, selected: { ...newSelected } });
  };

  const addOnDayValue = (day: string[], valueIndex: number) => {
    const selected: Selected | undefined = field?.selected;
    if (!selected) return;

    const amountOfFields = selected?.amountOfFields.split(',') || ['1'];

    const newValues: any = amountOfFields.map((val: string, valIndex: number) => {
      const oldValue = selected?.values?.[valIndex];
      if (valIndex === valueIndex) return { ...oldValue, onDays: day };
      return oldValue;
    });

    const newSelected = { ...selected, values: newValues };
    setField({ name: question.info.title.form, selected: newSelected });
  };

  // const skipAnswerCheck = (form: string): boolean => {
  //   // const noDays = form.startsWith('onDay'); // wenn eine frage Tageabhängig ist, aber keine tage definiert sind
  //   const foundation = ['round', 'onDayDuration'].includes(form) && structure?.foundation === 'person'; // Wenn pro Person
  //   const duration = ['roundDiscount', 'onDayRoundDiscount'].includes(form) && structure?.duration === 'fixed';
  //   return foundation || duration;
  // };

  const getInput = (answer: AnsInfo, valueIndex: number, values: any) => {
    if (answer.inputType === 'textarea') return <TextInput icon={answer.icon} value={values?.[valueIndex]?.value} label={answer.label} name={`${answer.name}+${valueIndex}`} placeholder={answer.placeholder} required change={setNewValue} />;
    if (answer.inputType === 'image') return <ImgInput label={`Anzeigebild für "${service?.serviceName}"`} fileName={`${valueIndex}`} name={`${answer.name}+${valueIndex}`} folderPath={folderPath} size={[900, 900]} hasImage={values?.[valueIndex].value} change={() => console.log('hochgeladen')} />;
    if (answer.inputType === 'dayPicker') return <DayValue valueIndex={valueIndex} options={openingDays} values={values?.[valueIndex]?.onDays} addOnDayValue={addOnDayValue} />;
    if (answer.options) return <OptionInput icon={answer.icon} value={values?.[valueIndex]?.value} optionValue={values?.[valueIndex]?.option} label={answer.label} options={answer.options || []} name={`${answer.name}+${valueIndex}`} placeholder={answer.placeholder} error={!values?.[valueIndex] ? 'invalid' : 'valid'} required change={setNewValue} />;
    if (answer.isMultiField) return <MultiInput type={answer.inputType} icon={answer.icon} value={values?.[valueIndex]?.value} label={answer.label} name={`${answer.name}+${valueIndex}`} placeholder={answer.placeholder} required change={setNewValue} />;
    return <NormalInput icon={answer.icon} value={values?.[valueIndex]?.value} label={answer.label} name={`${answer.name}+${valueIndex}`} type={answer.inputType} placeholder={answer.placeholder} required change={setNewValue} />;
  };

  return (
    <Fragment>
      <header class={style.header}>
        <TopButton action={toggleOverview} title="Übersicht" color="white" />
        <h2>{question.info.question}</h2>
      </header>

      <main style={{ padding: '15px 15px 5px 15px' }}>
        {question.info.type === 'onService' && !service?.serviceName?.[0] && <p class="red">Definiere mindestens eine Leistung.</p>}
        {question.answers.map((answer: AnsInfo) => {
          // if (skipAnswerCheck(answer.name)) return;

          const { type } = question.info;
          const amountOfFields: string[] = field?.selected?.amountOfFields?.split(',') || ['1'];
          const values = field?.selected?.values;
          const isChecked: boolean = field?.selected?.name === answer.name;
          const exceptions = (type === 'onService' && service?.serviceName?.[0]) || (type === 'simple' && answer.inputType === 'dayPicker' && isChecked);

          return (
            <Fragment key={answer.name}>
              {['onService'].includes(type) ? service?.serviceType === answer.name && (
                <p><strong>{answer.label}</strong></p>
              ) : (
                <CheckInput label={answer.label} value={isChecked} name={answer.name} change={toggle} />
              )}

              {((isChecked && !['simple'].includes(type)) || exceptions) && (
              <Fragment>
                <p style={{ color: 'var(--fifth)' }}>{answer.info}</p>
                {answer.name === 'onDayDuration' && (
                  <Item icon={<IconInfoCircle color="var(--orange)" />} label="Bitte weisen sie allen Tagen mindestens eine zeitliche Dauer zu" text="Sie können mehrere feste Zeiten pro Tag definieren. Rundendauern können nur einmal pro Tag definiert werden." type="info" />
                )}
                {amountOfFields.map((amountString: string, valueIndex: number) => (
                  <Fragment key={amountString}>
                    {answer.onDay && answer.inputType !== 'dayPicker' && <DayValue options={openingDays} values={values?.[valueIndex]?.onDays} valueIndex={valueIndex} addOnDayValue={addOnDayValue} />}
                    {getInput(answer, valueIndex, values)}
                  </Fragment>
                ))}

                {question.info.type !== 'simple' && question.info.title.form !== 'serviceName' && !['onService'].includes(type) && <AddRemove action={extraField} isFirst={!(amountOfFields?.[1])} name={answer.name} />}
              </Fragment>
              )}
            </Fragment>
          );
        })}
      </main>

      <FormButton action={nextQuestion} label={validation === 'valid' ? 'Weiter' : 'Bitte Vervollständige die Anworten'} disabled={validation === 'notValid' || !field?.selected} />
      {question.info.availableActivated && <button class={style.skipButton} type="button" disabled={validation === 'notValid'} onClick={skip}>Frage überspringen</button>}

      <InfoBox title={question.info.advice} text={question.info.example} />
      {question.info.explanation && <InfoBox text={question.info.explanation} />}

      <Chip label="Unterstützung von Guidex erhalten" type="delete" action={() => console.log('d')} />
    </Fragment>
  );
};

export default QuestForm;
