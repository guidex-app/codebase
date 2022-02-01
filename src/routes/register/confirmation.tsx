import { FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';
import { CheckCircle } from 'react-feather';
import FormButton from '../../components/form/basicButton';
import TextHeader from '../../components/iconTextHeader';

const Confirmation: FunctionalComponent = () => (
  <div class="small_size_holder" style={{ padding: '60px 15px' }}>

    <TextHeader icon={<CheckCircle color="green" />} title="Willkommen an Bord" text="Du bist erfolgreich registriert" />

    <h3>Stelle jetzt in 15 Minuten deine Unternehmung online</h3>

    <FormButton label="Jetzt anlegen" action={() => route('/company/basic/new')} />
  </div>
);

export default Confirmation;
