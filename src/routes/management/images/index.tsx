import { Fragment, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { route } from 'preact-router';
import { Image, Info } from 'react-feather';

import BackButton from '../../../components/backButton';
import FormButton from '../../../components/form/basicButton';
import ImgInput from '../../../components/form/imgInput';
import TextHeader from '../../../components/iconTextHeader';
import Item from '../../../components/item';
import { fireDocument } from '../../../data/fire';
import { mergeUnique } from '../../../helper/array';
import useCompany from '../../../hooks/useCompany';
import { Activity } from '../../../interfaces/activity';

interface ActivityProp {
    activityID: string;
    activity: Activity;
    uid: string;
}

const Images: FunctionalComponent<ActivityProp> = ({ activity, activityID, uid }: ActivityProp) => {
  const data = useCompany(activityID, activity);
  if (!data || !uid) {
    return (
      <TextHeader
        icon={<Image color="#ff375e" />}
        title="Bilder"
        text="Bitte fügen sie Bilder ihrer Unternehmung/Location hinzu"
      />
    );
  }

  const [state, setState] = useState<string[]>(data.state);

  const updateImage = (name: string) => {
    const newState = mergeUnique([name], state || []);
    setState(newState);
  };

  const validateForm = async () => {
    await fireDocument(`activities/${data.title.form}`, { state }, 'update');

    route(`/company/documents/${data.title.form}`);
  };

  return (
    <Fragment>
      <TextHeader
        icon={<Image color="#ff375e" />}
        title="Bilder"
        text="Bitte fügen sie Bilder ihrer Unternehmung/Location hinzu"
      />
      <main class="small_size_holder">
        <BackButton url={`/company/dashboard/${activityID}`} />

        <form>
          <section class="group form">
            <Item type="info" icon={<Info color="var(--orange)" />} label="Info zum Upload" text="Das aktualisieren der Bilder dauert bis zu einem Tag" />
            <ImgInput
              fileName="image1"
              label="Bild 1 auswählen (JPG/JPEG)."
              name="image1"
              folderPath={`activities%2F${data.title.form}`}
              size={[1200, 900]}
              hasImage={!!data?.state?.includes('image1')}
              change={updateImage}
            />
            <ImgInput
              fileName="image2"
              label="Bild 2 auswählen (JPG/JPEG)."
              name="image2"
              folderPath={`activities%2F${data.title.form}`}
              size={[1200, 900]}
              hasImage={!!data?.state?.includes('image2')}
              change={updateImage}
            />
            <ImgInput
              fileName="image3"
              label="Bild 3 auswählen (JPG/JPEG)."
              name="image3"
              folderPath={`activities%2F${data.title.form}`}
              size={[1200, 900]}
              hasImage={!!data?.state?.includes('image3')}
              change={updateImage}
            />
            <ImgInput
              fileName="image4"
              label="Bild 4 auswählen (JPG/JPEG)."
              name="image4"
              folderPath={`activities%2F${data.title.form}`}
              size={[1200, 900]}
              hasImage={!!data?.state?.includes('image4')}
              change={updateImage}
            />
          </section>

          <FormButton action={validateForm} label="Speichern und weiter" />

        </form>

      </main>
    </Fragment>
  );
};

export default Images;
