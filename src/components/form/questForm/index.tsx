/* eslint-disable no-nested-ternary */
import { IconInfoCircle } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { AnsInfo, Questions, Selected, ServiceField, ServiceInfo, Structure } from '../../../interfaces/company';
import Chip from '../../chip';
import Item from '../../item';
import TopButton from '../../topButton';
import AddRemove from '../addRemove';
import FormButton from '../basicButton';
import BasicInput from '../basicInput';
import CheckInput from '../checkInput';
import ImgInput from '../imgInput';
import InfoBox from '../infoBox/infoBox';
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
    structure?: Structure;
    save: (data: ServiceField) => void; // Speicherfunktion
}

const QuestForm: FunctionalComponent<QuestFormProps> = ({ questions, service, openingDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'], serviceFields, folderPath, structure, save }: QuestFormProps) => {
  const [question, setQuestion] = useState<Questions | undefined>();
  const [field, setField] = useState<ServiceField | undefined>();
  const [validation, setValidation] = useState<'valid' | 'notValid'>('notValid');
  const [showOverview, setShowOverview] = useState(false);

  // speichert die aktuelle frage und antworten
  const nextQuestion = () => { if (field && validation === 'valid') save(field); };

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
    console.log(question?.info.availableActivated ? 'valid' : 'notValid', field?.selected);
    if (!field?.selected) return setValidation(question?.info.availableActivated ? 'valid' : 'notValid');

    if (question?.info.type === 'simple' && !field?.selected?.name.startsWith('onDay')) return setValidation('valid');
    // const checkDayGroups: boolean = field.selected.name === 'day' && field.selected.onDays?.length !== openings?.length;
    const dayValues: boolean = field.selected.name.startsWith('onDay') && !!field.selected.values?.some((x) => !x?.onDays?.[0]);
    const checkFoundation: boolean = field.selected.name === 'onDayObject' && !field.selected.values?.[0].onDays?.[0];
    const checkOnService: boolean = question?.info.type === 'onService' && (!service?.serviceName || !field.selected.values?.every((x) => !!x.value));
    const checkAmountOfFields: boolean = question?.info.type !== 'simple' && (field.selected.values?.length !== (field.selected.amountOfFields?.split(',') || ['1'])?.length);
    const checkOptionField: boolean = !!question?.answers.find((x) => field.selected?.name === x.name)?.options?.[0] && !field.selected.values?.every((x) => !!x.option);
    const checkIsMulti: boolean = question?.info.type !== 'simple' && field.selected.values?.findIndex((sub) => !sub.value || sub.value.toString().startsWith('-') || sub.value.toString().endsWith('-')) !== -1;
    const checkDuration: boolean = field.selected.name === 'onDayDuration' && openingDays.some((x: string) => {
      let counter = 0;
      field.selected?.values?.forEach((val) => val?.onDays?.forEach((days) => {
        if (days === x) counter += 1;
      }));
      return counter !== 1;
    });

    const isInvalid = checkAmountOfFields || checkIsMulti || checkOnService || dayValues || checkOptionField || checkDuration || checkFoundation;

    console.log({ checkAmountOfFields, checkIsMulti, checkOnService, dayValues, checkOptionField, checkDuration, checkFoundation });
    return setValidation(isInvalid ? 'notValid' : 'valid');
  };

  const toggleOverview = () => {
    if (showOverview && !question) getQuestion(0);
    setShowOverview(!showOverview);
  };

  useEffect(() => { validateField(); }, [field]); // new value validation
  useEffect(() => { getQuestion(); }, [serviceFields]); // init and new questions

  if (showOverview) return <Overview fields={serviceFields?.map((x) => x.name)} showBackButton={!!question} close={toggleOverview} questions={questions} select={getQuestion} />;
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
    console.log('newValue', value);

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

  const skipAnswerCheck = (form: string): boolean => {
    // const noDays = form.startsWith('onDay'); // wenn eine frage Tageabhängig ist, aber keine tage definiert sind
    const foundation = ['round', 'onDayDuration'].includes(form) && structure?.foundation === 'person'; // Wenn pro Person
    const duration = ['roundDiscount', 'onDayRoundDiscount'].includes(form) && structure?.duration === 'fixed';
    return foundation || duration;
  };

  return (
    <Fragment>
      <header class={style.header} style={{ paddingBottom: '15px' }}>
        <TopButton action={toggleOverview} title="Übersicht" />
        <h2>{question.info.question}</h2>
      </header>

      <main style={{ paddingBottom: '5px' }}>
        {/* {question.info.availableActivated && (
        <CheckInput
          label={question.info.availableText || 'Hat keinen Einfluss'}
          value={field?.notIsChecked}
          name="isNot"
          change={isNot}
        />
        )} */}
        {question.info.type === 'onService' && !service?.serviceName?.[0] && <p class="red">Definiere mindestens eine Leistung.</p>}
        {question.answers.map((answer: AnsInfo) => {
          if (skipAnswerCheck(answer.name)) return;

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
                  <Item icon={<IconInfoCircle color="var(--orange)" />} label="Bitte weisen sie allen Tagen eine zeitliche Dauer zu" type="info" />
                )}
                {amountOfFields.map((amountString: string, valueIndex: number) => (
                  <Fragment key={amountString}>
                    {answer.inputType === 'image' ? (
                      <ImgInput
                        label={`Anzeigebild für "${service?.serviceName}"`}
                        fileName={amountString.replace(' ', '_').toLowerCase()}
                        name={`${answer.name}+${valueIndex}`}
                        folderPath={folderPath}
                        size={[900, 900]}
                        hasImage={values?.[valueIndex].value}
                        // change={(name) => setNewValue(name, `${answer.name}+${amountIndex}`)}
                      />
                    ) : (answer.inputType === 'dayPicker' ? (
                      <DayValue valueIndex={valueIndex} options={openingDays} values={values?.[valueIndex]?.onDays} addOnDayValue={addOnDayValue} />
                    ) : (
                      <div style={answer.onDay ? { backgroundColor: 'var(--fourth)', borderRadius: '10px', padding: '5px 10px', marginBottom: '10px' } : undefined}>
                        {answer.onDay && <DayValue options={openingDays} values={values?.[valueIndex]?.onDays} valueIndex={valueIndex} addOnDayValue={addOnDayValue} />}
                        {answer.options ? (
                          <OptionInput icon={answer.icon} value={values?.[valueIndex]?.value} optionValue={values?.[valueIndex]?.option} label={answer.label} options={answer.options || []} name={`${answer.name}+${valueIndex}`} placeholder={answer.placeholder} error={!values?.[valueIndex] ? 'invalid' : 'valid'} required change={setNewValue} />
                        ) : (
                          <BasicInput icon={answer.icon} isMulti={answer.isMultiField} value={values?.[valueIndex]?.value} label={answer.label} name={`${answer.name}+${valueIndex}`} type={answer.inputType} placeholder={answer.placeholder} error={!values?.[valueIndex] ? 'invalid' : 'valid'} required change={setNewValue} />
                        )}
                      </div>
                    ))}
                  </Fragment>
                ))}

                {question.info.type !== 'simple' && question.info.title.form !== 'serviceName' && !['onService'].includes(type) && <AddRemove action={extraField} isFirst={!(amountOfFields?.[1])} name={answer.name} />}
              </Fragment>
              )}
            </Fragment>
          );
        })}
      </main>

      <FormButton action={nextQuestion} label={field?.selected || !question.info.availableActivated ? `${validation === 'notValid' ? 'Bitte Vervollständige die Anworten' : 'Weiter'}` : question.info.availableText || 'Hat keinen Einfluss'} disabled={validation === 'notValid'} />

      <InfoBox title={question.info.advice} text={question.info.example} />
      {question.info.explanation && <InfoBox text={question.info.explanation} />}

      <Chip label="Unterstützung von Guidex erhalten" type="delete" action={() => console.log('')} />
    </Fragment>
  );
};

export default QuestForm;
