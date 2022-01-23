import { Fragment, FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';
import { useEffect, useState } from 'preact/hooks';
import { Book, CheckCircle, Info, MousePointer } from 'react-feather';
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
        title="Einrichtung"
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
    image: { value: false, type: 'image', required: false },
  };

  const { fields, formState, changeField, isValid } = useForm(formInit);

  const [imageState, setImageState] = useState<'empty' | 'loading' | 'finished'>('empty');
  const [categoryList, setCategoryList] = useState<{ title: { name: string, form: string }, filter: string[] }[]>([]);
  const [isIndoorAndOutdoor, setIsIndoorAndOutdoor] = useState<boolean>(false);

  useEffect(() => {
    if (!categoryList.length) {
      getFireCollection('catInfos', false).then((catInfoList: any) => (
        catInfoList && setCategoryList(catInfoList.map((x: any) => ({ title: x.title, filter: x.filter })))
      ));
    }
  }, []);

  const navigate = (finished?: true) => (formState.image !== 'valid' || finished) && route('/company');

  const validateForm = async () => {
    if (isValid()) {
      if (formState.image === 'valid') setImageState('loading');

      const basic = await {
        ...(activityID === 'new' && { member: [uid] }),
        title: data?.title || { name: fields.title, form: replaceSpecialCharacters(fields.title) },
        category: { name: fields.category, form: replaceSpecialCharacters(fields.category) },
        filter: fields.filter,
        ...(fields.image > 0 && { state: mergeUnique(['thumbnail'], activity?.state || []) }),
        ...((fields.description || activity.description) && { description: fields.description }),
      };

      console.log(basic);
      await fireDocument(`activities/${basic.title.form}`, basic, activityID === 'new' ? 'set' : 'update');

      navigate();
    }
  };

  const changeCat = async (value: string) => {
    const cat = categoryList.find((x) => x.title.name === value);
    if (!cat) return;

    const ind: boolean = cat.filter.includes('lo_indoor');
    const out: boolean = cat.filter.includes('lo_outdoor');
    setIsIndoorAndOutdoor(ind && out);

    if (ind && !out) changeField(['Indoor'], 'filter');
    if (out && !ind) changeField(['Outdoor'], 'filter');
    changeField(cat.title.name, 'category');
  };

  return (
    <Fragment>
      <TextHeader
        icon={<Info color="#63e6e1" />}
        title="Einrichtung"
        text="Bitte geben Sie hier den Namen Ihrer Unternehmung an z.B. „Lasertag Licht und mehr“.
        Der Name Ihrer Unternehmung ist ihr öffentliches Label"
      />
      <main class="small_size_holder">
        <BackButton url={activityID !== 'new' ? `/company/dashboard/${activityID}` : '/company'} />

        <form>
          <section class="group form">
            <h3>Einrichtung und Zuweisung</h3>
            <BasicInput
              icon={<CheckCircle />}
              type="text"
              label="Anzeigename:"
              name="title"
              value={fields.title}
              placeholder="Der Titel der Unternehmung"
              error={formState.title}
              disabled={activityID !== 'new'}
            //   errorMessage="Bitte geben Sie einen Namen an"
              required
            //   disabled={!!activity && 'Sie habe Ihre Unternehmung bereits definiert'}
              change={changeField}
            />

            <SelectInput
              label="Kategorie:"
              name="category"
              icon={<Book />}
              value={fields.category}
              options={categoryList?.map((x) => x.title.name)}
              error={formState.category}
              required
              change={changeCat}
            />

            {fields.category?.form && isIndoorAndOutdoor && (
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
            <h3>Präsentation</h3>

            <ImgInput
              fileName={fields.title}
              folderPath="activities"
              name="image"
              error={formState.image}
              startUpload={imageState === 'loading'}
              uploadFinished={() => navigate(true)}
              size={[700, 900]}
              hasImage={!!data?.state?.includes('thumbnail')}
              change={changeField}
            />

            <BasicInput
            //   icon={textOutline}
            // type="textarea"
              icon={<MousePointer />}
              label="Wer sind wir?"
              name="description"
              type="textarea"
              value={fields.description}
              placeholder="Beschreibung und Alleinstellungsmerkmal der Unternehmung"
              error={formState.description}
            // errorMessage="Bitte geben Sie eine Beschreibung an"
              change={changeField}
            />

            <p class="grey">
              Die Beschreibung gibt einen kurzen Überblick über die Unternehmung. Probieren sie eine kurze aber genaue Beschreibung aller wichtigen
              Merkmale zu definieren.
            </p>

          </section>

          <FormButton action={validateForm} label={!activity?.title?.form ? 'Unternehmung anlegen' : 'Speichern'} />

        </form>

      </main>
    </Fragment>
  );
};

export default Basic;
