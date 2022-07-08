import { Fragment, FunctionalComponent, h } from 'preact';

import FormButton from '../../components/form/basicButton';
import NormalInput from '../../components/form/Inputs/basic';
import TextInput from '../../components/form/Inputs/textArea';
import PickInput from '../../components/form/pickInput';
import { fireDocument } from '../../data/fire';
import { replaceSpecialCharacters } from '../../helper/string';
import useForm from '../../hooks/useForm';

interface CreateListProps {
    data?: any;
    uid?: string;
    close: (newDoc?: any) => void;
}

const CreateList: FunctionalComponent<CreateListProps> = ({ data, uid, close }: CreateListProps) => {
  const { form, isValid, changeForm } = useForm({
    title: data?.title.name || '',
    type: data?.type || 'Privat',
    description: data?.description || '',
    color: data?.list.color || 'Rot',
  }, ['title', 'color', 'type']);

  const validation = async () => {
    if (isValid && uid) {
      const newFields = {
        ...form,
        title: { name: form.title, form: replaceSpecialCharacters(form.title) },
        uid,
      };
      await fireDocument(`lists/${newFields.title.form}_${uid}`, newFields, !data?.title?.form ? 'set' : 'update');

      close(newFields);
    }
  };

  return (
    <Fragment>

      <NormalInput
        type="string"
        label="Name der Liste"
        name="title"
        value={form.title}
        placeholder="Name der Unternehmung"
        required
        change={changeForm}
      />

      <TextInput
        label="Beschreibung"
        name="description"
        value={form.description}
        placeholder="Beschreibe deine Liste"
        required
        change={changeForm}
      />

      <PickInput
        label="Welche Art-Liste möchtest du anlegen?"
        name="type"
        value={form.type}
        options={['Privat', 'Geteilt', 'Voting']}
        change={changeForm}
      />

      <PickInput
        label="Wähle eine Farbe für die Liste"
        name="color"
        value={form.color}
        options={['Rot', 'Grün', 'Gelb', 'Orange', 'Blau', 'Lila']}
        change={changeForm}
      />

      <FormButton label={data ? 'Liste speichern' : 'Liste anlegen'} action={validation} />
    </Fragment>
  );
};

export default CreateList;
