import { Fragment, FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';
import { Home, Key, MapPin, Navigation, PhoneCall, Type } from 'react-feather';

import BackButton from '../../../components/backButton';
import FormButton from '../../../components/form/basicButton';
import BasicInput from '../../../components/form/basicInput';
import CheckInput from '../../../components/form/checkInput';
import TextHeader from '../../../components/iconTextHeader';
import { fireDocument } from '../../../data/fire';
import useCompany from '../../../hooks/useCompany';
import useForm from '../../../hooks/useForm';
import { ActContact, Activity } from '../../../interfaces/activity';
import { FormInit } from '../../../interfaces/form';

interface ActivityProp {
    activityID: string;
    activity: Activity;
    uid: string;
}

const Contact: FunctionalComponent<ActivityProp> = ({ activity, activityID, uid }: ActivityProp) => {
  const data = useCompany(activityID, activity);
  if (!data || !uid) {
    return (
      <TextHeader
        icon={<Home color="#ff5613" />}
        title="Kontakt"
        text="Geben Sie den Nutzern kontaktinfos"
      />
    );
  }

  const formInit: FormInit = {
    hasGuidexContact: { value: data?.guidexContact || true, type: 'boolean', required: false },
    hasCustomerContact: { value: data?.customerContact || true, type: 'boolean', required: false },
    hasHouseNumber: { value: !data?.address?.houseNumber || true, type: 'boolean', required: false },

    guidexContactName: { value: data?.guidexContact?.name, type: 'string', required: false },
    guidexContactPhone: { value: data?.guidexContact?.phone, type: 'phone', required: false },

    customerContactPhone: { value: data?.customerContact?.phone, type: 'phone', required: false },
    customerContactWebsite: { value: data?.customerContact?.website, type: 'website', required: false },

    hasInvoiceAddress: { value: !data?.hasInvoiceAddress || true, type: 'boolean', required: false },
    street: { value: data?.address?.street || '', type: 'string', required: true },
    houseNumber: { value: data?.address?.houseNumber || '', type: 'number', required: false },
    place: { value: data?.address?.place || '', type: 'string', required: true },
    plz: { value: data?.address?.plz || '', type: 'plz', required: true },
  };

  const { fields, formState, changeField, isValid } = useForm(formInit);

  const navigate = (finished?: true) => (formState.image !== 'valid' || finished) && route(`/company/openings/${activityID}`);

  const validateForm = async () => {
    if (isValid()) {
      const contactFields: ActContact = {
        ...(fields.hasGuidexContact && {
          guidexContact: {
            name: fields.guidexContactName || '',
            phone: fields.guidexContactPhone || '',
          },
        }),
        ...(fields.hasCustomerContact && {
          customerContact: {
            website: fields.customerContactWebsite || '',
            phone: fields.customerContactPhone || '',
          },
        }),
        hasInvoiceAddress: fields.hasInvoiceAddress,
        address: {
          street: fields?.street,
          houseNumber: fields?.houseNumber,
          place: fields?.place,
          plz: fields?.plz,
        },
      };

      console.log(contactFields);

      await fireDocument(`activities/${data.title.form}`, contactFields, 'update');

      navigate();
    }
  };

  return (
    <Fragment>
      <TextHeader
        icon={<Home color="#ff5613" />}
        title="Kontakt"
        text="Hier definieren sie alles, was für die Kontaktaufnahme wichtig ist."
      />
      <main class="small_size_holder">
        <BackButton url={`/company/dashboard/${activityID}`} />

        <form>
          <section class="group form">
            <h3>Wo befindet sich Ihre Unternehmung?</h3>

            <CheckInput
              label="Die angegebene Adresse ist die gleiche wie die Rechnungsadresse"
              name="hasInvoiceAddress"
              value={fields.hasInvoiceAddress}
              change={changeField}
            />

            <BasicInput
              icon={<MapPin />}
              type="text"
              label="Straße"
              name="street"
              value={fields.street}
              placeholder="Straße bitte angeben"
              error={formState.street}
            //   errorMessage="Bitte gebe eine Straße an. Hausnummer im unteren Feld angeben."
              required
              change={changeField}
            />

            <CheckInput
              label="Wir haben eine genaue Hausnummer"
              name="hasHouseNumber"
              value={fields.hasHouseNumber}
              change={changeField}
            />

            <BasicInput
              icon={<Key />}
              type="number"
              label="Haus Nr."
              name="houseNumber"
              disabled={fields.emptyHouseNumber}
              value={!fields.emptyHouseNumber ? fields.houseNumber : ''}
              placeholder="Ihre Hausnummer"
              error={!fields.hasHouseNumber && 'Die Hausnummer ist deaktiviert' ? 'valid' : 'invalid'}
            //   errorMessage="Bitte geben Sie eine Hausnummer an"
              change={changeField}
              required={fields.hasHouseNumber}
            />

            <BasicInput
              icon={<Navigation />}
              type="text"
              label="Ort/Stadt"
              name="place"
              value={fields.place}
              placeholder="z.B. Hamburg"
              error={formState.place}
            //   errorMessage="Bitte geben Sie einen Ort an"
              required
              change={changeField}
            />

            <BasicInput
              icon={<Navigation />}
              type="number"
              label="Postleitzahl"
              name="plz"
              value={fields.plz}
              placeholder="Ihre Postleitzahl"
              error={formState.plz}
            //   errorMessage="Bitte geben Sie eine Postleitzahl an"
              required
              change={changeField}
            />

            <p class="orange">Checkbox mit &quot;Angegebene Address ist gleich rechnungsadresse&quot; und zusätzlich brauchen wir die steuernummer</p>
            <p class="grey">Bitte achten sie auf eine genaue Angabe ihrer Adresse. Denn diese wird für den Ausgabeort der Unternehmung verwendet.</p>

          </section>

          <section class="group form">
            <h3>Ansprechpartner für Guidex vor Ort</h3>

            <CheckInput
              label="Wir haben einen extra Ansprechpartner vor Ort"
              name="hasGuidexContact"
              value={fields.hasGuidexContact}
              change={changeField}
            />

            {fields.hasGuidexContact && (
            <Fragment>
              <BasicInput
                icon={<Type />}
                type="text"
                label="Ansprechpartner:"
                name="guidexContactName"
                value={fields.guidexContactName}
                placeholder="Name der des Ansprechpartners"
                error={formState.guidexContactName}
                // errorMessage="Bitte gebe einen Ansprechpartner an"
                required
                change={changeField}
              />

              <BasicInput
                icon={<PhoneCall />}
                type="number"
                label="Tel:"
                name="guidexContactPhone"
                value={fields.guidexContactPhone}
                placeholder="Tel. des Ansprechpartners"
                error={formState.guidexContactPhone}
                // errorMessage="Bitte gebe einen Telefonnummer an"
                required
                change={changeField}
              />
            </Fragment>
            )}

            <p class="grey">*Der Ansprechpartner wird nur für interne Fragen benötigt und wird nicht veröffentlicht.</p>

          </section>

          <section class="group form">
            <h3>Kontakt für Nutzer</h3>

            <CheckInput
              label="Wir haben einen Kontakt (für Nutzer)"
              name="hasCustomerContact"
              value={fields.hasCustomerContact}
              change={changeField}
            />

            {fields.hasCustomerContact && (
            <Fragment>
              <BasicInput
                // icon={laptopOutline}
                type="text"
                label="Web:"
                name="customerContactWebsite"
                value={fields.customerContactWebsite}
                placeholder="Tel. des Ansprechpartners"
                error={formState.customerContactWebsite}
                // errorMessage="Bitte gebe einen Website an"
                required
                change={changeField}
              />

              <BasicInput
                // icon={laptopOutline}
                type="number"
                label="Tel.:"
                name="customerContactPhone"
                value={fields.customerContactPhone}
                placeholder="Kundentelefon bitte angeben"
                error={formState.customerContactPhone}
                // errorMessage="Bitte gebe ein Kundentelefon an"
                required
                change={changeField}
              />
            </Fragment>
            )}

            <p class="grey">Wie können Nutzer Sie finden oder fragen bezüglich Angebote stellen. Gebe dafür eine Website und Telefonnummer an.</p>

          </section>

          <FormButton action={validateForm} label="Speichern" />

        </form>

      </main>
    </Fragment>
  );
};

export default Contact;
