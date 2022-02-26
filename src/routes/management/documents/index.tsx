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
import { Activity } from '../../../interfaces/activity';

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

  const [state, setState] = useState<string[]>(data.state);

  const validateForm = async () => {
    await fireDocument(`activities/${data.title.form}`, { state }, activityID === 'new' ? 'set' : 'update');
    route(`/company/services/${data.title.form}`);
  };

  const changeDocument = (name: string) => {
    const newState = mergeUnique([name], state);
    setState(newState);
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
              name="agb"
              folderPath={`activities/${data.title.form}`}
              placeholder="+"
              size={[1200, 900]}
              hasImage={!!data?.state?.includes('image1')}
              change={changeDocument}
            />
            <ImgInput
              fileName="image2"
              label="Wiederrufsbelehrung"
              name="wb"
              folderPath={`activities/${data.title.form}`}
              placeholder="+"
              size={[1200, 900]}
              hasImage={!!data?.state?.includes('image2')}
              change={changeDocument}
            />
            <ImgInput
              fileName="image3"
              label="Einverständniserklärung für Minderjährige"
              name="eve"
              folderPath={`activities/${data.title.form}`}
              placeholder="+"
              size={[1200, 900]}
              hasImage={!!data?.state?.includes('image3')}
              change={changeDocument}
            />
          </section>

          <FormButton action={validateForm} label="Speichern und weiter" />

        </form>

      </main>
    </Fragment>
  );
};

export default Documents;
