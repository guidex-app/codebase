import { IconInfoCircle, IconPhoto } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { route } from 'preact-router';

import BackButton from '../../../components/backButton';
import FormButton from '../../../components/form/basicButton';
import ImgInput from '../../../components/form/imgInput';
import TextHeader from '../../../components/infos/iconTextHeader';
import Item from '../../../components/item';
import { fireDocument } from '../../../data/fire';
import { mergeUnique } from '../../../helper/array';
import useCompany from '../../../hooks/useCompany';
import { Activity } from '../../../interfaces/activity';

interface ActivityProp {
    activityID: string;
    activity: Activity;
}

const Images: FunctionalComponent<ActivityProp> = ({ activity, activityID }: ActivityProp) => {
  const data: Activity | undefined = useCompany(activityID, activity);
  const header = (
    <TextHeader
      icon={<IconPhoto color="#ff375e" />}
      title="Fotos"
      text="Lassen sie ihr Erlebnis mit hochwertigen Fotos erstrahlen."
    />
  );
  if (!data) return header;

  const [state, setState] = useState<string[] | undefined>(data?.state);

  const updateImage = (name: string) => {
    const newState = mergeUnique([name], state || []);
    setState(newState);
  };

  const validateForm = async () => {
    console.log(state);
    await fireDocument(`activities/${data.title.form}`, { state }, 'update');

    route(`/company/documents/${data.title.form}`);
  };

  return (
    <Fragment>
      {header}
      <main class="small_size_holder">
        <BackButton url={`/company/dashboard/${activityID}`} />

        <form>
          <section class="group form">
            <Item type="info" icon={<IconInfoCircle color="var(--orange)" />} label="Info zum Upload" text="Das aktualisieren der Bilder dauert bis zu einem Tag" />
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
