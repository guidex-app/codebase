import { Fragment, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { route } from 'preact-router';
import { CreditCard } from 'react-feather';

import BackButton from '../../../components/backButton';
import FormButton from '../../../components/form/basicButton';
import ImgInput from '../../../components/form/imgInput';
import TextHeader from '../../../components/iconTextHeader';
import { fireDocument } from '../../../data/fire';
import { mergeUnique } from '../../../helper/array';
import useCompany from '../../../hooks/useCompany';
import useForm from '../../../hooks/useForm';
import { Activity } from '../../../interfaces/activity';
import { FormInit } from '../../../interfaces/form';

interface ActivityProp {
    activityID: string;
    activity: Activity;
    uid: string;
}

const Documents: FunctionalComponent<ActivityProp> = ({ activity, activityID, uid }: ActivityProp) => {
  const data = useCompany(activityID, activity);
  if (!data || !uid) {
    return (
      <TextHeader
        icon={<CreditCard color="#ff375e" />}
        title="Dokumente"
        text="Bitte lade alle nötigen Dokumente hoch"
      />
    );
  }

  const formInit: FormInit = {
    image1: { value: false, type: 'image', required: false },
    image2: { value: false, type: 'image', required: false },
    image3: { value: false, type: 'image', required: false },
    image4: { value: false, type: 'image', required: false },
  };

  const { fields, formState, changeField, isValid } = useForm(formInit);

  const [imageState, setImageState] = useState<'empty' | 'loading' | 'finished'>('empty');
  const [finished, setFinished] = useState<string[]>([]);

  const navigate = (isFinished?: true) => (formState.image !== 'valid' || isFinished) && route(`/company/services/${data.title.form}`);

  const uploadFinished = (name: string) => {
    const filledImages: (string | false)[] = Object.entries(fields).map(([key, value]) => (value && value > 0 ? key : false));
    const validImages = filledImages.filter((x) => !!x);
    if (validImages?.length > 0) {
      const allUploadsComplete = finished.length + 1 === validImages.length;
      console.log(finished.length, filledImages.length);
      if (allUploadsComplete) {
        const newState = mergeUnique(data?.state || [], validImages);
        fireDocument(`activities/${data.title.form}`, { state: newState }, 'update').then(() => navigate());
      } else {
        setFinished([...finished, name]);
      }
    }
  };

  const validateForm = async () => {
    if (isValid()) {
      const filledImages: (string | false)[] = Object.entries(fields).map(([key, value]) => (value && value > 0 ? key : false)).filter((x) => !!x);
      if (filledImages.length !== 0) setImageState('loading');
      else navigate();
    }
  };

  return (
    <Fragment>
      <TextHeader
        icon={<CreditCard color="#ff375e" />}
        title="Dokumente"
        text="Lade Dokumente hoch"
      />
      <main class="small_size_holder">
        <BackButton url={`/company/dashboard/${activityID}`} />

        <form>
          <section class="group form">
            <h3>Deine Dokumente</h3>
            <ImgInput
              fileName="image1"
              label="AGB"
              name="image1"
              folderPath={`activities/${data.title.form}`}
              placeholder="+"
              error={formState.image1}
              startUpload={imageState === 'loading'}
              uploadFinished={uploadFinished}
              size={[1200, 900]}
              hasImage={!!data?.state?.includes('image1')}
              change={changeField}
            />
            <ImgInput
              fileName="image2"
              label="Wiederrufsbelehrung"
              name="image2"
              folderPath={`activities/${data.title.form}`}
              placeholder="+"
              error={formState.image2}
              startUpload={imageState === 'loading'}
              uploadFinished={uploadFinished}
              size={[1200, 900]}
              hasImage={!!data?.state?.includes('image2')}
              change={changeField}
            />
            <ImgInput
              fileName="image3"
              label="Einverständniserklärung für Minderjährige"
              name="image3"
              folderPath={`activities/${data.title.form}`}
              placeholder="+"
              error={formState.image3}
              uploadFinished={uploadFinished}
              startUpload={imageState === 'loading'}
              size={[1200, 900]}
              hasImage={!!data?.state?.includes('image3')}
              change={changeField}
            />
          </section>

          <FormButton action={validateForm} label="Speichern und weiter" />

        </form>

      </main>
    </Fragment>
  );
};

export default Documents;
