import { IconCheck } from '@tabler/icons';
import { FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';

import FormButton from '../../components/form/basicButton';

const Confirmation: FunctionalComponent = () => (
  <div class="small_size_holder" style={{ padding: '70px 15px', textAlign: 'center' }}>
    <IconCheck size={80} color="orange" />
    {/* <TextHeader icon={<CheckCircle color="green" />} title="Willkommen an Bord" text="Du bist erfolgreich registriert" /> */}
    <h1 style={{ paddingTop: '20px' }}>Willkommen an Bord!</h1>
    <p>In 15 Minuten deine Unternehmung online stellen</p>

    <FormButton label="Jetzt loslegen" type="outline" action={() => route('/company/basic/new')} />
  </div>
);

export default Confirmation;
