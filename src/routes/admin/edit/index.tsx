import { Fragment, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';

import AddRemove from '../../../components/form/addRemove';
import FormButton from '../../../components/form/basicButton';
import BasicInput from '../../../components/form/basicInput';
import ImgInput from '../../../components/form/imgInput';
import SelectInput from '../../../components/form/selectInput';
import { fireDocument } from '../../../data/fire';
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

  const [imageState, setImageState] = useState<'empty' | 'loading' | 'finished'>('empty');

  const form: FormInit = {
    title: { value: data !== 'new' && data?.title ? { name: data.title.name || '', form: data.title.form || '' } : { name: '', form: '' }, type: 'title', required: true },
    type: { value: data !== 'new' && data?.type ? data.type : 'seopage', type: 'string', required: true },
    description: { value: data !== 'new' && data?.description ? data.description : '', type: 'string', required: false },
    partitions: { value: data !== 'new' && data?.partitions ? data.partitions : [''], type: 'string[]', required: false },
    filter: { value: data !== 'new' && data?.filter ? data.filter : [], type: 'string[]', required: false },
    state: { value: data !== 'new' && data?.state ? data.state : 'inEdit', type: 'string', required: false },
    image: { type: 'image', required: false },
  };
  const { formState, fields, isValid, changeField } = useForm(form);

  const changeTitleValue = (value:any) => {
    changeField({ name: value, form: replaceSpecialCharacters(value) }, 'title');
  };

  const getCorrectFields = () => ({
    ...(data === 'new' && { title: fields.title }),
    filter: fields.filter,
    description: fields.description,
    ...(type === 'topics' && {
      partitions: fields.partitions?.filter((x: string) => x !== '') || undefined,
      type: fields.type,
      state: fields.state,
    }),
  });

  const navigate = (finished?: true) => {
    if (formState.image !== 'valid' || finished) {
      close(getCorrectFields());
    }
  };

  //   const uploadFinished = () => navigate(true);

  //   const deleteTopic = () => {
  //     if (data !== 'new' && data?.title?.form) {
  //       const collectionName = type === 'categories' ? 'catInfos' : 'topics';
  //       deleteFireDocument(collectionName, data.title.form);
  //       deleteStoragePath(`${type}/${data.title.form}`);
  //     }
  //     // closeModal(true, formVals);
  //   };

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

  const editTopicForm = async () => {
    if (isValid()) {
      if (formState.image === 'valid') setImageState('loading');

      const newFields = getCorrectFields();
      console.log(newFields, data);

      fireDocument(`${type}/${data.title.form || fields.title.form}`, newFields, data !== 'new' ? 'update' : 'set')
        .then(() => navigate());
    }
  };

  const deleteTopic = () => {
    console.log('Löschen');
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
        value={fields.title?.name}
        disabled={data !== undefined}
                //   disabled={data !== 'new' ? 'Bereits definiert' : undefined}
        placeholder="Name der Unternehmung"
        error={formState.title}
                //   errorMessage="Bitte gebe einen Namen an"
        required
        change={changeTitleValue}
      />

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

      {(!fields.type || (fields.type && ['quickfilter', 'topicpage', 'seopage'].indexOf(fields.type) !== -1)) && (
        <FormButton action={openFilter} label="Filter bearbeiten" type="outline" />
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

      <p class="grey">Die Zusammenfassung erlaubt keine &lt;HTML Tags&gt;. Und wird als Kurzbeschreibung angesehen. Achte darauf das, diese nicht zu lang ist.</p>

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

        <p class="grey">
          Hier wird der Haupttext definiert. Bei der SeoPage, werden die Abschnitte in Kacheln, versetzt angeordnet. Ansonsten wird ein neuer Absatz erstellt. Wenn ein Abschnitt leer gelassen wird, wird er beim speichern automatisch entfernt.
        </p>
      </Fragment>
      )}

      {fields.type !== 'notlisted' && fields.title?.form && (
      <ImgInput
        fileName={fields.title.form}
        folderPath={type}
        name="image"
        error={formState.image}
        uploadFinished={() => navigate(true)}
        startUpload={imageState === 'loading'}
        change={changeField}
        size={[700, 900]}
        hasImage={data !== 'new'}
        showSizeInfo
        editAble
      />
      )}

      <FormButton action={editTopicForm} />
      <FormButton label="Löschen" type="outline" action={deleteTopic} />
    </Fragment>
  );
};

export default Edit;
