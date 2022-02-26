import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { Book, CheckCircle, Info, Type } from 'react-feather';

import BackButton from '../../../components/backButton';
import FormButton from '../../../components/form/basicButton';
import BasicInput from '../../../components/form/basicInput';
import ImgInput from '../../../components/form/imgInput';
import PickInput from '../../../components/form/pickInput';
import SelectInput from '../../../components/form/selectInput';
import TextHeader from '../../../components/iconTextHeader';
import { fireDocument, getFireCollection } from '../../../data/fire';
import { mergeUnique } from '../../../helper/array';
import { replaceSpecialCharacters } from '../../../helper/string';
import useCompany from '../../../hooks/useCompany';
import useForm from '../../../hooks/useForm';
import { Activity } from '../../../interfaces/activity';
import { FormInit } from '../../../interfaces/form';

interface ActivityProps {
    activityID: string;
    activity: Activity;
    uid: string;
}

const Basic: FunctionalComponent<ActivityProps> = ({ activity, activityID, uid }: ActivityProps) => {
  const data = useCompany(activityID, activity);

  if ((!data && activityID !== 'new') || !uid) {
    return (
      <TextHeader
        icon={<Info color="#63e6e1" />}
        title="Unternehmungs-Informationen"
        text="Bitte geben Sie hier den Namen Ihrer Unternehmung an z.B. „Lasertag Licht und mehr“.
        Der Name Ihrer Unternehmung ist ihr öffentliches Label"
      />
    );
  }

  const formInit: FormInit = {
    title: { value: data?.title?.name, type: 'string', required: true },
    category: { value: data?.category?.name, type: 'string', required: true },
    filter: { value: data?.filter || ['Indoor'], type: 'string[]', required: true },
    description: { value: data?.description, type: 'string', required: false },
    state: { value: data.state, type: 'string[]', required: false },
  };

  const { fields, formState, changeField, isValid } = useForm(formInit);

  // const [imageState, setImageState] = useState<'empty' | 'loading' | 'finished'>('empty');
  const [categoryList, setCategoryList] = useState<{ title: { name: string, form: string }, filter: string[] }[]>([]);
  const [isIndoorAndOutdoor, setIsIndoorAndOutdoor] = useState<boolean>(false);

  useEffect(() => {
    if (!categoryList.length) {
      getFireCollection('catInfos', false).then((catInfoList: any) => (
        catInfoList && setCategoryList(catInfoList.map((x: any) => ({ title: x.title, filter: x.filter })))
      ));
    }
  }, []);

  const updateImage = (name: string) => {
    const newState = mergeUnique([name], fields.state || []);
    changeField(newState, 'state');
  };

  const validateForm = async () => {
    if (isValid()) {
      const basic = await {
        ...(activityID === 'new' && { member: [uid] }),
        title: data?.title || { name: fields.title, form: replaceSpecialCharacters(fields.title) },
        category: { name: fields.category, form: replaceSpecialCharacters(fields.category) },
        filter: fields.filter,
        state: fields.state,
        ...(fields.description && { description: fields.description }),
      };

      await fireDocument(`activities/${basic.title.form}`, basic, activityID === 'new' ? 'set' : 'update');

      route(`/company/contact/${replaceSpecialCharacters(fields.title)}`);
    }
  };

  const changeCat = async (value: string) => {
    const cat = categoryList.find((x) => x.title.name === value);
    if (!cat) return;

    const ind: boolean = cat.filter.includes('lo_indoor');
    const out: boolean = cat.filter.includes('lo_outdoor');
    console.log(cat.filter);
    setIsIndoorAndOutdoor(ind && out);

    if (ind && !out) changeField(['Indoor'], 'filter');
    if (out && !ind) changeField(['Outdoor'], 'filter');
    changeField(cat.title.name, 'category');
  };

  return (
    <Fragment>
      <TextHeader
        icon={<Info color="#63e6e1" />}
        title={activityID === 'new' ? 'Unternehmung anlegen' : 'Unternehmungs-Informationen'}
        text="Es ist Zeit sich unseren Nutzern vorzustellen."
      />
      <main class="small_size_holder">
        <BackButton url={activityID !== 'new' ? `/company/dashboard/${activityID}` : '/company'} />

        <form>
          <section class="group form">
            <BasicInput
              icon={<CheckCircle color="#fea00a" />}
              type="text"
              label="Name Ihrer Unternehmung"
              name="title"
              value={fields.title}
              placeholder="Wie lautet der Titel ihrer Unternehmung"
              error={formState.title}
              disabled={activityID !== 'new' || fields.state[0]}
            //   errorMessage="Bitte geben Sie einen Namen an"
              required
            //   disabled={!!activity && 'Sie habe Ihre Unternehmung bereits definiert'}
              change={changeField}
            />

            <SelectInput
              label="Kategorie"
              name="category"
              placeholder="Ordnen Sie sich einer Kategorie zu"
              icon={<Book color="#fea00a" />}
              value={fields.category}
              options={categoryList?.map((x) => x.title.name)}
              error={formState.category}
              required
              change={changeCat}
            />

            {fields.category && isIndoorAndOutdoor && (
            <PickInput
              label="Wo seid Ihr verfügbar?"
              name="filter"
              options={['Indoor', 'Outdoor']}
              value={fields.filter}
              error={formState.filter}
                // errorMessage="Bitte wähle Deine Location"
              required
              change={changeField}
            />
            )}

          </section>

          <section class="group form">

            <ImgInput
              label={data?.state?.includes('thumbnail') ? 'Anzeigebild aktualisieren' : 'Anzeigebild hochladen'}
              fileName={fields.title}
              folderPath="activities"
              name="thumbnail"
              size={[900, 900]}
              hasImage={!!data?.state?.includes('thumbnail')}
              change={updateImage}
            />

            <BasicInput
            //   icon={textOutline}
            // type="textarea"
              icon={<Type />}
              label="Was sollten Nutzer über sie wissen?"
              name="description"
              type="textarea"
              value={fields.description}
              placeholder="Die Beschreibung gibt einen kurzen Überblick über die Unternehmung. Probieren sie eine kurze aber genaue Beschreibung aller wichtigen
              Merkmale zu definieren."
              error={formState.description}
            // errorMessage="Bitte geben Sie eine Beschreibung an"
              change={changeField}
            />

          </section>

          <FormButton action={validateForm} label={!activity?.title?.form ? 'Unternehmung anlegen' : 'Speichern'} />

        </form>

      </main>
    </Fragment>
  );
};

export default Basic;
