import { IconBlockquote, IconForms, IconInfoCircle } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { route } from 'preact-router';

import BackButton from '../../../components/backButton';
import FormButton from '../../../components/form/basicButton';
import ImgInput from '../../../components/form/imgInput';
import NormalInput from '../../../components/form/Inputs/basic';
import TextInput from '../../../components/form/Inputs/textArea';
import PickInput from '../../../components/form/pickInput';
import TextHeader from '../../../components/iconTextHeader';
import { fireDocument } from '../../../data/fire';
import { mergeUnique } from '../../../helper/array';
import { replaceSpecialCharacters } from '../../../helper/string';
import useCompany from '../../../hooks/useCompany';
import useForm from '../../../hooks/useForm';
import { Activity } from '../../../interfaces/activity';
import { CatInfo } from '../../../interfaces/categorie';
import ChooseCat from './chooseCat';

interface ActivityProps {
    activityID: string;
    activity: Activity;
    updateActivity: (act: any) => void;
    uid: string;
}

const Basic: FunctionalComponent<ActivityProps> = ({ activity, activityID, updateActivity, uid }: ActivityProps) => {
  const data: Activity | undefined = useCompany(activityID, activity);

  const header = (
    <TextHeader
      icon={<IconInfoCircle color="var(--orange)" />}
      title={activityID === 'new' ? 'Erlebnis anlegen' : 'Erlebnis bearbeiten'}
      text="Es wird Zeit sich unseren Nutzern vorzustellen. Welche Art von Erlebnis möchtest du anbieten?"
    />
  );

  if (!data && activityID !== 'new') return header;

  const { form, changeForm, isValid } = useForm({
    title: data?.title?.name,
    category: data?.category?.name,
    filter: data?.filter,
    state: data?.state,
    description: data?.description,
  }, ['title', 'category']);

  const [isIndoorAndOutdoor, setIsIndoorAndOutdoor] = useState<boolean>(false);

  const updateImage = (name: string) => {
    const newState = mergeUnique([name], form.state || []);
    changeForm(newState, 'state');
  };

  const validateForm = () => {
    if (isValid && form.title && form.category) {
      const basic = {
        ...(activityID === 'new' && { member: [uid] }),
        title: data?.title || { name: form.title, form: replaceSpecialCharacters(form.title) },
        category: { name: form.category, form: replaceSpecialCharacters(form.category) },
        filter: form.filter,
        ...(form.state?.[0] && { state: form.state }),
        ...(form.description && { description: form.description }),
      };

      fireDocument(`activities/${basic.title.form}`, basic, activityID === 'new' ? 'set' : 'update').then(() => {
        updateActivity(basic);
        setTimeout(() => {
          route(`/company/contact/${basic.title.form}`);
        }, activityID === 'new' ? 500 : 0);
      });
    }
  };

  const changeCat = async (cat?: CatInfo) => {
    if (!cat) return changeForm(undefined, 'category');

    const ind: boolean = cat.filter.includes('lo_indoor');
    const out: boolean = cat.filter.includes('lo_outdoor');

    setIsIndoorAndOutdoor(ind && out);

    if (ind && !out) changeForm(['Indoor'], 'filter');
    if (out && !ind) changeForm(['Outdoor'], 'filter');
    changeForm(cat.title.name, 'category');
  };

  return (
    <Fragment>
      {header}
      <main class="small_size_holder">
        <BackButton url={activityID !== 'new' ? `/company/dashboard/${activityID}` : '/company'} />

        <form>
          <section class="group form">
            <NormalInput
              icon={<IconForms color="#fea00a" />}
              type="string"
              label="Wie soll ihr Erlebnis heißen?"
              name="title"
              value={form?.title}
              placeholder="Wie heißt ihr Erlebnis"
              disabled={activityID !== 'new' || !!form.state?.[0]}
              required
              change={changeForm}
            />

            <ChooseCat currentCat={form?.category} changeCat={changeCat} disabled={!!data?.state?.includes('online')} />

            {form.category && isIndoorAndOutdoor && (
            <PickInput
              label="Wo seid Ihr verfügbar?"
              name="filter"
              options={['Indoor', 'Outdoor']}
              value={form.filter}
                // errorMessage="Bitte wähle Deine Location"
              required
              change={changeForm}
            />
            )}

          </section>

          <section class="group form">

            <ImgInput
              label={data?.state?.includes('thumbnail') ? 'Anzeigebild aktualisieren' : 'Anzeigebild hochladen'}
              text="Das anzeige Bild ist als erstes für die Nutzer sichtbar"
              fileName={form.title}
              folderPath="activities"
              name="thumbnail"
              size={[900, 900]}
              hasImage={!!data?.state?.includes('thumbnail')}
              change={updateImage}
            />

            {/* <small style={{ color: 'var(--fifth)' }}>Lassen sie ihr Erlebnis mit einem hochwertigen Foto erstrahlen.</small> */}

          </section>

          <section class="group form">

            <TextInput
            //   icon={textOutline}
            // type="textarea"
              icon={<IconBlockquote color="var(--orange)" />}
              label="Beschreibung"
              name="description"
              value={form.description}
              placeholder="Die Beschreibung gibt einen kurzen Überblick über die Unternehmung. Probieren sie eine kurze aber genaue Beschreibung aller wichtigen
              Merkmale zu definieren."
            // errorMessage="Bitte geben Sie eine Beschreibung an"
              change={changeForm}
            />

          </section>

          <FormButton action={validateForm} disabled={!isValid} label={!activity?.title?.form ? 'Erlebnis anlegen' : 'Erlebnis Speichern'} />

        </form>

      </main>
    </Fragment>
  );
};

export default Basic;
