import { IconFilter } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';

import AddRemove from '../../../components/form/addRemove';
import FormButton from '../../../components/form/basicButton';
import BasicInput from '../../../components/form/basicInput';
import ImgInput from '../../../components/form/imgInput';
import SelectInput from '../../../components/form/selectInput';
import Item from '../../../components/item';
import { fireDocument } from '../../../data/fire';
import { mergeUnique } from '../../../helper/array';
import { replaceSpecialCharacters } from '../../../helper/string';
import useForm from '../../../hooks/useForm';
import { FormInit } from '../../../interfaces/form';

interface EditProps {
    data: any;
    type: 'catInfos' | 'topics';
    close: (data: any, filter?: boolean) => void;
}

const Edit: FunctionalComponent<EditProps> = ({ data, type, close }: EditProps) => {
  const topicTypes: string[] = ['seopage', 'seotext', 'topicpage', 'topictext', 'notlisted', 'quickfilter'];

  const form: FormInit = {
    title: { value: data !== 'new' && data?.title.name, type: 'string', required: true },
    type: { value: data !== 'new' && data?.type ? data.type : 'seopage', type: 'string', required: true },
    description: { value: data !== 'new' && data?.description ? data.description : '', type: 'string', required: false },
    partitions: { value: data !== 'new' && data?.partitions ? data.partitions : [''], type: 'string[]', required: false },
    filter: { value: data !== 'new' && data?.filter ? data.filter : [], type: 'string[]', required: false },
    belongsTo: { value: (data !== 'new' && data?.belongsTo) || '', type: 'string', required: false },
    state: { value: data !== 'new' && data?.state ? data.state : [], type: 'string[]', required: false },
  };
  const { formState, fields, isValid, changeField } = useForm(form);

  const getCorrectFields = () => ({
    ...(data === undefined ? { title: { name: fields.title, form: replaceSpecialCharacters(fields.title) } } : { title: data.title }),
    filter: fields.filter,
    description: fields.description,
    state: fields.state,
    ...(type === 'topics' ? {
      partitions: fields.partitions?.filter((x: string) => x !== '') || undefined,
      type: fields.type,
    } : {
      belongsTo: fields.belongsTo,
    }),
  });

  const changePartition = (value: any, key: string) => {
    const correctKey: number = parseInt(key, 10);
    const newPartition = fields.partitions || [''];
    newPartition.splice(correctKey, 1, value);
    changeField([...(newPartition)] || [''], 'partitions');
  };

  const addPartition = (typ: 'add' | 'remove') => {
    const getPartition: string[] = fields.partitions;
    if (getPartition) {
      if (typ === 'add') {
        getPartition.push('');
      } else {
        const getLastIndex = getPartition.length - 1;
        getPartition.splice(getLastIndex, 1);
      }
    }
    changeField(getPartition, 'partitions');
  };

  const changeImage = (name: string) => {
    const newState = mergeUnique([name], fields.state);
    changeField(newState, 'state');
  };

  const validation = async () => {
    if (isValid()) {
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

      <BasicInput
                //   icon={listOutline}
        type="text"
        label="Name:"
        name="title"
        value={fields.title}
        disabled={data !== undefined}
        placeholder="Name der Unternehmung"
        error={formState.title}
        required
        change={changeField}
      />

      {type === 'catInfos' && (
      <BasicInput
        type="text"
        label="Gibt es eine Überkategorie?"
        name="belongsTo"
        value={fields.belongsTo}
        placeholder="Gebe den exakten Namen / ID an"
        change={changeField}
      />
      )}

      {type === 'topics' && (
      <SelectInput
        // size={data === 'new' ? '6' : '12'}
        label="Type:"
        name="type"
        value={fields.type}
        options={topicTypes}
        // placeholder="Wähle eine Kategorie"
        error={formState.type}
        // errorMessage="Bitte wähle eine Kategorie"
        required
        change={changeField}
      />
      )}

      {fields.type !== 'notlisted' && fields.title && (
      <ImgInput
        fileName={fields.title}
        folderPath={type === 'topics' ? 'topics' : 'categories'}
        name="image"
        label="Thumbnail hochladen/anpassen"
        change={changeImage}
        size={[700, 900]}
        hasImage={data !== 'new'}
      />
      )}

      {(!fields.type || (fields.type && ['quickfilter', 'topicpage', 'seopage'].indexOf(fields.type) !== -1)) && (
        <Item icon={<IconFilter color="var(--orange)" />} type="info" action={openFilter} label="Filter bearbeiten" text={fields.filter?.join(' | ') || ''} />
      )}

      <BasicInput
            // size="12"
        label="Zusammenfassung"
            // icon={listOutline}
        type="textarea"
        name="description"
        value={fields.description}
        placeholder="Zusammenfassung"
        error={formState.description}
            // errorMessage="Bitte gebe Text ein"
        required
        change={changeField}
      />

      <p style={{ color: 'var(--fifth)' }}>Die Zusammenfassung erlaubt keine &lt;HTML Tags&gt;. Und wird als Kurzbeschreibung angesehen. Achte darauf das, diese nicht zu lang ist.</p>

      {type !== 'catInfos' && fields.partitions && (
      <Fragment>
        <code>
          <span>&lt;h1&gt;Überschrift&lt;/h1&gt;</span>
          <span>&lt;h1&gt;Zwischenüberschrift&lt;/h1&gt;</span>
          <span>&lt;/hr&gt; für eine Trennlinie</span>
          <span>&lt;strong&gt;Fetter Text&lt;/strong&gt;</span>
          <span>&lt;/br&gt; für Zeilenumbruch</span>
          <span>&lt;blockquote&gt;Zitat&lt;/blockquote&gt;</span>
        </code>

        {fields.partitions.map((partition: string, partIndex: number) => (
          <BasicInput
                // size="12"
            label={`Abschnitt ${partIndex + 1}`}
                // icon={listOutline}
            type="textarea"
            name={partIndex.toString()}
            value={partition}
            placeholder="Dein Text..."
            error="valid"
                // errorMessage=""
            change={changePartition}
          />
        ))}

        <AddRemove action={addPartition} name="add" isFirst={!(fields.partitions?.[1])} />
      </Fragment>
      )}

      <FormButton action={validation} />
    </Fragment>
  );
};

export default Edit;
