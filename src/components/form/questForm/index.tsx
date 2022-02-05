/* eslint-disable no-nested-ternary */
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { AnsDB, AnsInfo, Questions, ServiceField, ServiceInfo } from '../../../interfaces/company';
import Chip from '../../chip';
import TopButton from '../../topButton';
import AddRemove from '../addRemove';
import FormButton from '../basicButton';
import BasicInput from '../basicInput';
import CheckInput from '../checkInput';
import ImgInput from '../imgInput';
import InfoBox from '../infoBox/infoBox';
import DayPicker from './dayPicker';
import Overview from './overview';
import style from './style.module.css';

interface QuestFormProps {
    questions: Questions[]; // Fragen
    serviceFields?: ServiceField[]; // Antworten des Service
    service?: ServiceInfo; // Serviceinfo oder noch nicht definiert
    folderPath?: string; // folderpath für image uploads
    openings?: (string | false)[];
    save: (data: ServiceField) => void; // Speicherfunktion
}

const QuestForm: FunctionalComponent<QuestFormProps> = ({ questions, service, openings, serviceFields, folderPath, save }: QuestFormProps) => {
  const [question, setQuestion] = useState<Questions | undefined>();
  const [field, setField] = useState<ServiceField | undefined>();
  const [days, setDays] = useState<string[] | undefined>(serviceFields?.find((x) => x.name === 'days')?.answers?.[0]?.values);
  const [validation, setValidation] = useState<'valid' | 'notValid'>('notValid');
  const [showOverview, setShowOverview] = useState(false);

  const nextButton = () => {
    if (field) {
      if (question?.info.title.form === 'days') setDays(field.answers?.[0]?.values);
      save(field);
    }
  }; // speichert die aktuelle frage und antworten

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

  /** validiert bei mehreren möglichen antworten ob der keine tage doppelt gwählt wurden (bei den tagen radio) */
  const checkboxValidation = (ans: AnsDB): boolean => {
    if (!ans.name.startsWith('onDay')) return false;

    const currentDays: (string | undefined)[] = ans.onDays || [];
    const getAllDays = [...currentDays];
    const isInvalid = !field?.answers?.every((a: AnsDB) => { // wenn keiner gefunden wird
      if (a.name === ans.name || !a.name.startsWith('onDay') || !a.onDays) return true; // springt zum nächsten
      return a.onDays?.every((day: (string | undefined)) => {
        if (day === undefined || !currentDays.includes(day)) { // wenn es nicht enthält zum nächsten
          if (getAllDays.indexOf(day) === -1) getAllDays.push(day);
          return true;
        }
        return false;
      });
    });

    if (!isInvalid && getAllDays.length !== days?.length) return true;

    return isInvalid;
  };

  /**
   * Validierung aller Felder
   * (Answers werden durchlaufen und wenn ein fehler entdeckt wird (true),
   * dann wird die every schleife abgebrochen (false) und "notValid zurückgegeben")
  */
  const validateField = () => {
    if (field?.notIsChecked) return setValidation('valid');
    let isValid: boolean = false;
    if (field?.answers?.[0]) {
      isValid = field.answers.every((ans: AnsDB) => {
        if (question?.info.type === 'simple' && !ans.name.startsWith('onDay')) return true;
        const checkOnDays: boolean = ans.name.startsWith('onDay') && (!ans.onDays || ans.onDays?.includes(undefined) || (question?.info.type !== 'simple' && ans.onDays?.length !== ans.values?.length));
        const checkOnService: boolean = question?.info.type === 'onService' && (!service?.serviceName || (ans.values?.includes(undefined) || false));
        const checkAmountOfFields: boolean = checkOnService && !(ans.values?.length === (ans.amountOfFields?.split(',') || ['1'])?.length);

        const checkIsMulti: boolean = question?.info.type !== 'simple' && ans.values?.findIndex((sub) => !sub || sub.toString().startsWith('-') || sub.toString().endsWith('-')) !== -1;
        const checkCheckbox: boolean = question?.info.type === 'checkbox' && checkboxValidation(ans);

        console.log({ checkAmountOfFields, checkIsMulti, checkOnService, checkCheckbox, checkOnDays });
        return !(checkAmountOfFields || checkIsMulti || checkOnService || checkCheckbox || checkOnDays);
      });
    }
    return setValidation(isValid ? 'valid' : 'notValid');
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
    const answerIndex: number = field?.answers?.findIndex((f) => f.name === name) || -1;
    let answers: AnsDB[] = field?.answers || [];

    if (value) { // checked
      if (question.info.type === 'radio' || question.info.type === 'simple') {
        answers = [{ amountOfFields: '1', name, ...(name === 'onDaysDuration' && days && { onDays: days }) }];
      } else {
        answers.push({ amountOfFields: '1', name });
      }
    } else { // not checked
      console.log('notChecked');
      answers.splice(answerIndex, 1);
    }
    setField({ name: question.info.title.form, answers: [...answers] });
    console.log({ name: question.info.title.form, answers: [...answers] });
  };

  const isNot = () => setField({ name: question.info.title.form, notIsChecked: true });

  /** Anzahl der Felder verändern. Bei "remove" wird der letzte Wert auch entfernt */
  const extraField = (type: 'remove' | 'add', answerForm: string) => {
    const newAnswers: AnsDB[] = field?.answers || [];
    const answerIndex: number = newAnswers[0] ? newAnswers?.findIndex((f) => f.name === answerForm) : -1;

    const amount: string[] = newAnswers[answerIndex]?.amountOfFields?.split(',') || ['1'];
    if (type === 'add') {
      amount.push((amount.length + 1).toString());
    } else {
      newAnswers[answerIndex]?.values?.splice(amount.length - 1);
      newAnswers[answerIndex]?.onDays?.splice(amount.length - 1);
      amount.pop();
    }

    const newAnswer = { ...(newAnswers[answerIndex] || []), name: answerForm, amountOfFields: amount.toString() };
    newAnswers.splice(answerIndex > -1 ? answerIndex : 0, 1, newAnswer);

    setField({ name: question.info.title.form, answers: [...newAnswers] });
  };

  /** Setzt neue Werte */
  const setNewValue = (value: any, key: string) => {
    const newAnswers: AnsDB[] = field?.answers || [];
    const [answerForm, position]: string[] = key.split('+');
    const answerIndex: number = newAnswers[0] ? newAnswers?.findIndex((f) => f.name === answerForm) : -1;

    const amount: string[] = newAnswers[answerIndex]?.amountOfFields?.split(',') || ['1'];
    const newValues = amount.map((val: string, valIndex: number) => (
      valIndex === +position ? value : (newAnswers[answerIndex]?.values?.[valIndex] || undefined)
    ));

    const newAnswer = { ...(newAnswers[answerIndex] || []), name: answerForm, values: [...newValues] };
    newAnswers.splice(answerIndex !== -1 ? answerIndex : 0, 1, newAnswer); // replace answer
    setField({ name: question.info.title.form, answers: [...newAnswers] });
    console.log({ name: question.info.title.form, answers: [...newAnswers] });
  };

  const addOnDayValue = (day: string, answerIndex: number, valueIndex: number) => {
    const newAnswers = field?.answers || [];
    const amountOfFields = newAnswers[answerIndex].amountOfFields.split(',') || ['1'];
    const onDays: (string | undefined)[] = amountOfFields.map((val, valIndex) => (
      valueIndex === valIndex ? day : newAnswers[answerIndex]?.onDays?.[valIndex]
    )) || [day];

    // HIER DIE FUNKTION EINBAUEN BEI 'SIMPLE' DAY FIELD MEHRERE TAGE EINFÜGEN KÖNNEN

    newAnswers.splice(answerIndex !== -1 ? answerIndex : 0, 1, { ...newAnswers[answerIndex], onDays }); // replace answer
    setField({ name: question.info.title.form, answers: [...newAnswers] });
  };

  return (
    <Fragment>
      <header class={style.header} style={{ paddingBottom: '15px' }}>
        <TopButton action={toggleOverview} title="Übersicht" />
        <h2>{question.info.question}</h2>
      </header>

      <main style={{ paddingBottom: '5px' }}>
        {question.info.availableActivated && (
        <CheckInput
          label={question.info.availableText || 'Hat keinen Einfluss'}
          value={field?.notIsChecked}
          name="isNot"
          change={isNot}
        />
        )}
        {question.info.type === 'onService' && !service?.serviceName?.[0] && <p class="red">Definiere mindestens eine Leistung.</p>}
        {question.answers.map((answer: AnsInfo) => {
          if (answer.name.startsWith('onDay') && !days?.[0]) return; // wenn eine frage Tageabhängig ist, aber keine tage definiert sind

          const getField: number = field?.answers ? field?.answers?.findIndex((g) => g.name === answer.name) : -1;
          const { type } = question.info;
          const amountOfFields = field?.answers?.[getField]?.amountOfFields ? field?.answers?.[getField]?.amountOfFields?.split(',') : ['1'];
          const { values, onDays } = field?.answers?.[getField] || { values: undefined, onDays: undefined };
          const exceptions = (type === 'onOpenings' && openings && getField > -1) || (type === 'onService' && service?.serviceName?.[0]) || (type === 'simple' && answer.inputType === 'dayPicker' && getField > -1);

          return (
            <Fragment key={answer.name}>
              {['onService'].includes(type) ? service?.serviceType === answer.name && (
                <p><strong>{answer.label}</strong></p>
              ) : (
                <CheckInput label={answer.label} value={getField > -1} name={answer.name} change={toggle} />
              )}

              {getField > -1 && type === 'onOpenings' && !openings && <p class="red">Konfigurieren Sie zuerst Ihre Öffnungszeiten</p>}
              {((getField > -1 && !['simple', 'onOpenings'].includes(type)) || exceptions) && (
              <Fragment>
                <p class="grey">{answer.info}</p>
                {amountOfFields.map((amountString: string, amountIndex: number) => (
                  <Fragment key={amountString}>
                    {answer.inputType === 'image' ? (
                      <ImgInput
                        label={`Anzeigebild für "${service?.serviceName}"`}
                        fileName={amountString.replace(' ', '_').toLowerCase()}
                        name={`${answer.name}+${amountIndex}`}
                        folderPath={folderPath}
                        error={values?.[amountIndex] ? 'valid' : 'invalid'}
                        startUpload
                        size={[1200, 900]}
                        hasImage={values?.[amountIndex]}
                        change={setNewValue}
                      />
                    ) : (answer.inputType === 'dayPicker' ? (
                      question.info.type !== 'simple' ? (
                        <DayPicker
                          name={`${answer.name}+${amountIndex}`}
                          values={values}
                          position={amountIndex}
                          change={setNewValue}
                          openings={openings}
                        />
                      ) : (
                        answer.onDay && (
                          days?.map((day: string) => <Chip small label={`${day}.`} type={onDays?.[amountIndex] === day ? 'active' : 'inactive'} key={day} action={() => addOnDayValue(day, getField, amountIndex)} />)
                        )
                      )
                    ) : (
                      <div style={answer.onDay ? { backgroundColor: '#2b303d', borderRadius: '10px', padding: '5px 10px', marginBottom: '10px' } : undefined}>
                        {answer.onDay && (
                          days?.map((day: string) => <Chip small label={`${day}.`} type={onDays?.[amountIndex] === day ? 'active' : 'inactive'} key={day} action={() => addOnDayValue(day, getField, amountIndex)} />)
                        )}
                        <BasicInput icon={answer.icon} isMulti={answer.isMultiField} value={values?.[amountIndex]} label={answer.label} name={`${answer.name}+${amountIndex}`} type={answer.inputType} placeholder={answer.placeholder} error={!values?.[amountIndex] ? 'invalid' : 'valid'} required change={setNewValue} />
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

      <FormButton action={nextButton} label="Weiter" disabled={validation === 'notValid'} />

      <InfoBox title={question.info.advice} text={question.info.example} />
      {question.info.explanation && <InfoBox text={question.info.explanation} />}

      <Chip label="Unterstützung von Guidex erhalten" type="delete" action={() => console.log('')} />
    </Fragment>
  );
};

export default QuestForm;
