import { IconFilter } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';

import AddRemove from '../../../components/form/addRemove';
import FormButton from '../../../components/form/basicButton';
import ImgInput from '../../../components/form/imgInput';
import NormalInput from '../../../components/form/Inputs/basic';
import SelectInput from '../../../components/form/Inputs/select';
import TextInput from '../../../components/form/Inputs/textArea';
import Item from '../../../components/item';
import { fireDocument } from '../../../data/fire';
import { mergeUnique } from '../../../helper/array';
import { replaceSpecialCharacters } from '../../../helper/string';
import useForm from '../../../hooks/useForm';

interface EditProps {
    data: any;
    type: 'catInfos' | 'topics';
    close: (data: any, filter?: boolean) => void;
}

const Edit: FunctionalComponent<EditProps> = ({ data, type, close }: EditProps) => {
  const topicTypes: string[] = ['seopage', 'seotext', 'topicpage', 'topictext', 'notlisted', 'quickfilter'];

  const { form, isValid, changeForm } = useForm({
    title: data !== 'new' && data?.title.name,
    type: data !== 'new' && data?.type ? data.type : 'seopage',
    description: data !== 'new' && data?.description ? data.description : '',
    partitions: data !== 'new' && data?.partitions ? data.partitions : [''],
    filter: data !== 'new' && data?.filter ? data.filter : [],
    belongsTo: (data !== 'new' && data?.belongsTo) || '',
    state: data !== 'new' && data?.state ? data.state : [],
  });

  const getCorrectFields = () => ({
    ...(data === undefined ? { title: { name: form.title, form: replaceSpecialCharacters(form.title) } } : { title: data.title }),
    filter: form.filter,
    description: form.description,
    state: form.state,
    ...(type === 'topics' ? {
      partitions: form.partitions?.filter((x: string) => x !== '') || undefined,
      type: form.type,
    } : {
      belongsTo: form.belongsTo,
    }),
  });

  const changePartition = (value: any, key: string) => {
    const correctKey: number = parseInt(key, 10);
    const newPartition = form.partitions || [''];
    newPartition.splice(correctKey, 1, value);
    changeForm([...(newPartition)] || [''], 'partitions');
  };

  const addPartition = (typ: 'add' | 'remove') => {
    const getPartition: string[] = form.partitions;
    if (getPartition) {
      if (typ === 'add') {
        getPartition.push('');
      } else {
        const getLastIndex = getPartition.length - 1;
        getPartition.splice(getLastIndex, 1);
      }
    }
    changeForm(getPartition, 'partitions');
  };

  const changeImage = (name: string) => {
    const newState = mergeUnique([name], form.state);
    changeForm(newState, 'state');
  };

  const validation = async () => {
    if (isValid) {
      const newFields = getCorrectFields();
      fireDocument(`${type}/${newFields.title.form}`, newFields, data === undefined ? 'set' : 'update').then(() => {
        close(getCorrectFields());
      });
    }
  };

  const openFilter = () => {
    close(getCorrectFields(), true);
  };

  return (
    <Fragment>

      <NormalInput
                //   icon={listOutline}
        type="string"
        label="Name:"
        name="title"
        value={form.title}
        disabled={data !== undefined}
        placeholder="Name der Unternehmung"
        required
        change={changeForm}
      />

      {type === 'catInfos' && (
      <NormalInput
        type="string"
        label="Gibt es eine Überkategorie?"
        name="belongsTo"
        value={form.belongsTo}
        placeholder="Gebe den exakten Namen / ID an"
        change={changeForm}
      />
      )}

      {type === 'topics' && (
      <SelectInput
        // size={data === 'new' ? '6' : '12'}
        label="Type:"
        name="type"
        value={form.type}
        options={topicTypes}
        required
        change={changeForm}
      />
      )}

      {form.type !== 'notlisted' && form.title && (
      <ImgInput
        fileName={form.title}
        folderPath={type === 'topics' ? 'topics' : 'categories'}
        name="image"
        label="Thumbnail hochladen/anpassen"
        change={changeImage}
        size={[700, 900]}
        hasImage={data !== 'new'}
      />
      )}

      {(!form.type || (form.type && ['quickfilter', 'topicpage', 'seopage'].indexOf(form.type) !== -1)) && (
        <Item icon={<IconFilter color="var(--orange)" />} type="info" action={openFilter} label="Filter bearbeiten" text={form.filter?.join(' | ') || ''} />
      )}

      <TextInput
        label="Zusammenfassung"
        name="description"
        value={form.description}
        placeholder="Zusammenfassung"
        required
        change={changeForm}
      />

      <p style={{ color: 'var(--fifth)' }}>Die Zusammenfassung erlaubt keine &lt;HTML Tags&gt;. Und wird als Kurzbeschreibung angesehen. Achte darauf das, diese nicht zu lang ist.</p>

      {type !== 'catInfos' && form.partitions && (
      <Fragment>
        <code>
          <span>&lt;h1&gt;Überschrift&lt;/h1&gt;</span>
          <span>&lt;h1&gt;Zwischenüberschrift&lt;/h1&gt;</span>
          <span>&lt;/hr&gt; für eine Trennlinie</span>
          <span>&lt;strong&gt;Fetter Text&lt;/strong&gt;</span>
          <span>&lt;/br&gt; für Zeilenumbruch</span>
          <span>&lt;blockquote&gt;Zitat&lt;/blockquote&gt;</span>
        </code>

        {form.partitions.map((partition: string, partIndex: number) => (
          <TextInput
            label={`Abschnitt ${partIndex + 1}`}
            name={partIndex.toString()}
            value={partition}
            placeholder="Dein Text..."
            change={changePartition}
          />
        ))}

        <AddRemove action={addPartition} name="add" isFirst={!(form.partitions?.[1])} />
      </Fragment>
      )}

      <FormButton action={validation} />
    </Fragment>
  );
};

export default Edit;
