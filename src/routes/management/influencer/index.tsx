import { IconAffiliate, IconCashBanknoteOff, IconEye, IconStar } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';

import BackButton from '../../../components/backButton';
import FormButton from '../../../components/form/basicButton';
import CheckInput from '../../../components/form/checkInput';
import NormalInput from '../../../components/form/Inputs/basic';
import PickInput from '../../../components/form/pickInput';
import TextHeader from '../../../components/infos/iconTextHeader';
import Item from '../../../components/item';
import { fireDocument } from '../../../data/fire';
import useCompany from '../../../hooks/useCompany';
import useForm from '../../../hooks/useForm';
import { Activity } from '../../../interfaces/activity';

interface InfluencerProps {
    activityID: string;
    activity: Activity;
}

const Influencer: FunctionalComponent<InfluencerProps> = ({ activity, activityID }: InfluencerProps) => {
  const data: Activity | undefined = useCompany(activityID, activity);
  const header = (
    <TextHeader
      icon={<IconStar color="#2fd159" />}
      title="Influencer Marketing"
      text="Vergrößern sie Ihre Reichweite durch das Influencer Marketing von Guidex"
    />
  );
  if (!data) return header;

  const { form, changeForm, isValid } = useForm({
    accept: false,
    type: [],
    tiktok: '',
    instagram: '',
    youtube: '',
  });

  const validateForm = async () => {
    if (isValid) {
      const formFields = {
        ...(form.filter && { filter: form.filter }),
      };
      await fireDocument(`activities/${data.title.form}`, formFields, 'update');

      route(`/company/images/${data.title.form}`);
    }
  };

  return (
    <Fragment>
      {header}
      <main class="small_size_holder">
        <BackButton url={`/company/dashboard/${activityID}`} />

        <form>
          <section class="group form">
            <h3>Info</h3>
            <p>Heutzutage ist Influencer-Marketing für viele Unternehmen einer der wichtigsten Kanäle, um potenzielle Kunden zu erreichen. Aufgrund der hohen Nachfrage nach Influencern können so hohe Kosten entstehen. Zudem ist die Auswahl von geeigneten Influencern und die Ansprache dieser, eine nicht zu unterschätzende Herausforderung.</p>
            <p>Guidex nimmt Ihnen auch hier die Arbeit ab und das sogar kostenlos. Das einzige was Sie dafür tun müssen ist ihre Freizeitunternehmung Influencern kostenlos zur Verfügung zu stellen. Über unser Influencer Netzwerk können diese dann ganz einfach von Influencern reserviert werden. Der Influencer verpflichtet sich in seinem erstellten Content sowohl den Account des Freizeitanbieters, als auch den Account von Guidex zu erwähnen. Die Gestaltung des Contents liegt einzig und allein beim Influencer selbst.</p>
            <Item label="Zusätzliche Reichweite vor Ort" icon={<IconEye color="orange" />} />
            <Item label="Keine Kosten" icon={<IconCashBanknoteOff color="yellow" />} />
            <Item label="Aufmerksamkeit & Content für Ihren Social-Media-Auftritt" icon={<IconAffiliate color="green" />} />
          </section>

          <section class="group form">
            <CheckInput
              label="Hiermit stimme ich zu über Guidex.app kostenlos meine Freizeitunternehmung an Influencer anzubieten. Die Guidex UG (haftungsbeschränkt) übernimmt dabei keinerlei Haftung für den produzierten Inhalt der Influencer. Eine Garantie oder Anspruch auf Werbung existiert nicht."
              name="accept"
              value={form.accept}
              change={changeForm}
            />
            {form.accept
            && (
            <Fragment>
              <PickInput
                label="Ab welcher Reichweite (Followern) möchten Sie TikToc-/Instagram-/YouTube-Influencern ihre Freizeitunternehmung kostenlos zur Verfügung stellen?"
                name="type"
                value={form.type}
                options={[
                  'Ab 10k - 15k (Micro)',
                  'Ab 15k - 50k (Regular)',
                  'Ab 50k - 100k (Rising)',
                  'Ab 100k - 500k (Mid)',
                  'Ab 500k - 1 Mio. (Macro)',
                  'Ab 1 Mio. (Mega)',
                ]}
                change={changeForm}
              />

              <h3>Ihre Accountnamen bei:</h3>
              <NormalInput
                label="TikTok"
                name="tiktok"
                value={form.tiktok}
                change={changeForm}
              />
              <NormalInput
                label="Instagram"
                name="instagram"
                value={form.instagram}
                change={changeForm}
              />
              <NormalInput
                label="YouTube"
                name="youtube"
                value={form.youtube}
                change={changeForm}
              />
            </Fragment>

            )}

          </section>

          <FormButton action={validateForm} disabled={!isValid} label="Speichern und weiter" />

        </form>

      </main>
    </Fragment>
  );
};

export default Influencer;
