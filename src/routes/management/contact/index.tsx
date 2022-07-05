import { IconBuilding, IconHome, IconMap, IconMapSearch, IconPhoneCall, IconSelect } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';

import BackButton from '../../../components/backButton';
import FormButton from '../../../components/form/basicButton';
import CheckInput from '../../../components/form/checkInput';
import NormalInput from '../../../components/form/Inputs/basic';
import TextHeader from '../../../components/iconTextHeader';
import { fireDocument } from '../../../data/fire';
import useCompany from '../../../hooks/useCompany';
import useForm from '../../../hooks/useForm';
import { ActContact, Activity } from '../../../interfaces/activity';

interface ActivityProp {
    activityID: string;
    activity: Activity;
}

const Contact: FunctionalComponent<ActivityProp> = ({ activity, activityID }: ActivityProp) => {
  const data: Activity | undefined = useCompany(activityID, activity);
  const header = (
    <TextHeader
      icon={<IconHome color="#ff5613" />}
      title="Kontakt"
      text="Hier definieren sie alles, was für die Kontaktaufnahme wichtig ist."
    />
  );
  if (!data) return header;

  const { form, changeForm, isValid } = useForm({
    guidexContactName: data?.guidexContact?.name,
    guidexContactPhone: data?.guidexContact?.phone,

    hasCustomerContact: data?.customerContact || true,
    customerContactPhone: data?.customerContact?.phone,
    customerContactWebsite: data?.customerContact?.website,

    street: data?.address?.street || '',
    place: data?.address?.place || '',
    plz: data?.address?.plz || '',

    hasInvoiceAddress: !data?.hasInvoiceAddress || false,

    invoiceStreet: data?.invoiceAddress?.street || '',
    invoicePlace: data?.invoiceAddress?.place || '',
    invoicePlz: data?.invoiceAddress?.plz || '',
  }, ['guidexContactName', 'guidexContactPhone', 'street', 'place', 'plz']);

  const validateForm = async () => {
    if (isValid) {
      const contactform: ActContact = {
        guidexContact: {
          name: form.guidexContactName || '',
          phone: form.guidexContactPhone || '',
        },
        ...(form.hasCustomerContact && {
          customerContact: {
            website: form.customerContactWebsite || '',
            phone: form.customerContactPhone || '',
          },
        }),
        hasInvoiceAddress: form.hasInvoiceAddress,
        ...(form.hasInvoiceAddress && {
          invoiceAddress: {
            street: form?.invoiceStreet,
            place: form?.invoicePlace,
            plz: form?.invoicePlz,
          },
        }),
        address: {
          street: form?.street,
          place: form?.place,
          plz: form?.plz,
        },
      };

      console.log(contactform);

      await fireDocument(`activities/${data.title.form}`, contactform, 'update');

      route(`/company/openings/${activityID}`);
    }
  };

  return (
    <Fragment>
      {header}
      <main class="small_size_holder">
        <BackButton url={`/company/dashboard/${activityID}`} />

        <form>
          <section class="group form">
            <h3>Wo möchten sie ihr Erlebnis anbieten?</h3>

            {['', ...(!form.hasInvoiceAddress ? ['invoice'] : [])].map((addressString: string) => (
              <Fragment>
                <NormalInput
                  icon={<IconBuilding color="#63e6e1" />}
                  type="street"
                  group
                  label="Straßenname und Hausnummer"
                  name={addressString ? 'invoiceStreet' : 'street'}
                  value={form[addressString ? 'invoiceStreet' : 'street']}
                  placeholder="Straße bitte angeben"
                  required
                  change={changeForm}
                />

                <NormalInput
                  icon={<IconMap color="#63e6e1" />}
                  type="string"
                  label="Ort"
                  group
                  name={addressString ? 'invoicePlace' : 'place'}
                  value={form[addressString ? 'invoicePlace' : 'place']}
                  placeholder="z.B. Hamburg"
                  required
                  change={changeForm}
                />

                <NormalInput
                  icon={<IconMapSearch color="#63e6e1" />}
                  type="plz"
                  label="Postleitzahl"
                  name={addressString ? 'invoicePlz' : 'plz'}
                  value={form[addressString ? 'invoicePlz' : 'plz']}
                  placeholder="Ihre Postleitzahl"
                  required
                  change={changeForm}
                />

                {!addressString && (
                <Fragment>
                  <h4>Rechnungsadresse</h4>
                  <CheckInput
                    label="Die angegebene Adresse entspricht der Rechnungsadresse"
                    name="hasInvoiceAddress"
                    value={form.hasInvoiceAddress}
                    change={changeForm}
                  />
                </Fragment>
                )}

              </Fragment>
            ))}

            <p style={{ color: 'var(--fifth)' }}>Bitte achten sie auf eine genaue Angabe ihrer Adresse. Denn diese wird für den Ausgabeort der Unternehmung verwendet.</p>

          </section>

          <section class="group form">
            <h3>Ansprechpartner für Guidex vor Ort</h3>

            <NormalInput
              icon={<IconSelect color="#fea00a" />}
              type="string"
              label="Ansprechpartner:"
              name="guidexContactName"
              group
              value={form.guidexContactName}
              placeholder="Name der des Ansprechpartners"
              required
              change={changeForm}
            />

            <NormalInput
              icon={<IconPhoneCall color="#fea00a" />}
              type="phone"
              label="Tel:"
              name="guidexContactPhone"
              value={form.guidexContactPhone}
              placeholder="Tel. des Ansprechpartners"
              required
              change={changeForm}
            />

            <p style={{ color: 'var(--fifth)' }}>*Der Ansprechpartner wird nur für interne Fragen benötigt und wird nicht veröffentlicht.</p>

          </section>

          <section class="group form">
            <h3>Kontakt für Nutzer</h3>

            <CheckInput
              label="Wir haben einen Kontakt (für Nutzer)"
              name="hasCustomerContact"
              value={form.hasCustomerContact}
              change={changeForm}
            />

            {form.hasCustomerContact && (
            <Fragment>
              <NormalInput
                type="string"
                label="Web:"
                group
                name="customerContactWebsite"
                value={form.customerContactWebsite}
                placeholder="Tel. des Ansprechpartners"
                required
                change={changeForm}
              />

              <NormalInput
                label="Tel.:"
                type="phone"
                name="customerContactPhone"
                value={form.customerContactPhone}
                placeholder="Kundentelefon bitte angeben"
                required
                change={changeForm}
              />
            </Fragment>
            )}

            <p style={{ color: 'var(--fifth)' }}>Wie können Nutzer Sie finden oder fragen bezüglich Angebote stellen. Gebe dafür eine Website und Telefonnummer an.</p>

          </section>

          <FormButton action={validateForm} disabled={!isValid} label="Speichern" />

        </form>

      </main>
    </Fragment>
  );
};

export default Contact;
