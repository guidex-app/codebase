/* eslint-disable @typescript-eslint/no-unused-vars */
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, GitCommit, Upload } from 'react-feather';

import Popup from '../../../container/popup';
import { replaceSpecialCharacters } from '../../../helper/string';
import useStorage from '../../../hooks/useStorage';
import Chip from '../../chip';
import Item from '../../item';
import FormButton from '../basicButton';
import style from './style.module.css';

interface ImgInputProps {
    label?: string,
    text?: string,
    fileName: string,
    name: string,
    folderPath?: string,
    size: [number, number],
    hasImage: boolean,
    change?: (name: string) => void;
}

/**
 * Die Bilder werden in den Maßen (Width x Height)
 * Small: 250x200
 * Medium: 600x450
 * Large: 1200x900
 */
const ImgInput: FunctionalComponent<ImgInputProps> = ({ change, hasImage, size, fileName, folderPath, name, text, label = '*Thumbnail' }: ImgInputProps) => {
  const { progress, setUpload } = useStorage();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [newImage, setNewImage] = useState<File | Blob | undefined>();
  const [imgPosition, setImgPosition] = useState<[('center' | 'left' | 'right'), ('top' | 'bottom' | 'middle')]>(['center', 'middle']);

  const uploadImage = () => {
    const imageName = replaceSpecialCharacters(fileName);
    if (imageName && folderPath && progress === 0 && !!newImage) setUpload({ file: newImage, fileName: imageName, folderPath });
  };

  const dataURItoBlob = (dataURI: string) => {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) byteString = atob(dataURI.split(',')[1]);
    else byteString = unescape(dataURI.split(',')[1]);
    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i += 1) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  };

  const getImagePosition = (imgWidth: number, imgHeight: number) => {
    const [canvasWidth, canvasHeight] = size;
    const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);

    const center: number = (canvasWidth - imgWidth * ratio) / 2;
    const middle: number = (canvasHeight - imgHeight * ratio) / 2;

    const shift = {
      middle: 0,
      top: -middle,
      bottom: middle,
      left: -center,
      right: center,
      center: 0,
    };

    const centerShiftX = center + shift[imgPosition[0]];
    const centerShiftY = middle + shift[imgPosition[1]];

    console.log('wird ausgerichtet', imgPosition);

    return [centerShiftX, centerShiftY, ratio];
  };

  const convertImage = () => {
    const getFile: any = document.getElementById(`${name}_fileinput`);

    const preview: any = document.getElementById(`${name}_preview`);
    const preview1: any = document.getElementById(`${name}_preview1`);
    const preview2: any = document.getElementById(`${name}_preview2`);

    const file = getFile?.files?.[0];
    console.log('drinene');

    if (getFile && file) {
      const reader = new FileReader();

      reader.onloadend = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = () => {
          // prepare canvas
          const canvas: any = document.getElementById(`${name}_canvas`);
          [canvas.width, canvas.height] = size;
          const ctx = canvas.getContext('2d');
          // get new position
          const [centerShiftX, centerShiftY, ratio] = getImagePosition(image.width, image.height);

          // set new position
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0, image.width, image.height, centerShiftX, centerShiftY, image.width * ratio, image.height * ratio);

          // generate image
          const dataURL = canvas.toDataURL('image/jpeg', { progressive: true });
          const toBlob = dataURItoBlob(dataURL);

          // set position previews
          preview.style.backgroundImage = `url("${dataURL}")`;
          if (size[0] === 700 && size[1] === 900) {
            preview1.style.backgroundImage = `url("${dataURL}")`;
            preview2.style.backgroundImage = `url("${dataURL}")`;
          }

          setNewImage(toBlob);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const changePosition = (value: any, isVertical: boolean) => {
    setImgPosition(isVertical ? [imgPosition[0], value] : [value, imgPosition[1]]);
  };

  useEffect(() => { convertImage(); }, [imgPosition]);
  useEffect(() => {
    if (progress === -1) {
      setIsOpen(false);
      if (change) change(name);
    }
  }, [progress]);

  const removeFile = () => {
    const getFile: any = document.getElementById(`${name}_fileinput`);
    setNewImage(undefined);
    getFile.value = '';
  };

  const getImageUrl = () => {
    const correctFileName = fileName && replaceSpecialCharacters(fileName);
    return `https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/${folderPath}%2F${correctFileName}%2F${correctFileName}_250x200`;
  };

  return (
    <Fragment>
      <Item type="info" text={text} image={hasImage ? getImageUrl() : undefined} icon={hasImage ? undefined : <Upload color="var(--orange)" />} label={label} action={() => setIsOpen(true)} />

      {isOpen && (
      <Popup close={() => setIsOpen(false)}>
        <Fragment>
          <h3 style={{ padding: '10px 10px 0 10px' }}>Bild hochladen</h3>
          <small style={{ display: 'block', padding: '0 10px 10px 10px', color: 'var(--fifth)' }}>(Das Bild sollte mind. den maßen {size[0]}x{size[1]}px entsprechen)</small>

          <input
            type="file"
            accept="image/jpeg"
            class={style.fileinput}
            id={`${name}_fileinput`}
            onChange={() => convertImage()}
            required
          />

          <div class={style.preview}>
            <Chip small label="Neues Bild wählen" type="active" action={removeFile} />
            <div class={style.preview_position}>
              <button onClick={() => changePosition('left', false)} type="button" aria-label="ausrichten"><ChevronLeft color={imgPosition[0] === 'left' ? 'var(--red)' : undefined} /></button>
              <button onClick={() => changePosition('center', false)} type="button" aria-label="ausrichten"><AlignCenter color={imgPosition[0] === 'center' ? 'var(--red)' : undefined} /></button>
              <button onClick={() => changePosition('right', false)} type="button" aria-label="ausrichten"><ChevronRight color={imgPosition[0] === 'right' ? 'var(--red)' : undefined} /></button>
              <button onClick={() => changePosition('top', true)} type="button" aria-label="ausrichten"><ChevronUp color={imgPosition[1] === 'top' ? 'var(--red)' : undefined} /></button>
              <button onClick={() => changePosition('middle', true)} type="button" aria-label="ausrichten"><GitCommit color={imgPosition[1] === 'middle' ? 'var(--red)' : undefined} /></button>
              <button onClick={() => changePosition('bottom', true)} type="button" aria-label="ausrichten"><ChevronDown color={imgPosition[1] === 'bottom' ? 'var(--red)' : undefined} /></button>
            </div>
            <div id={`${name}_preview`} class={style.preview_image} />
            {size[0] === 700 && size[1] === 900 && (
              <Fragment>
                <div id={`${name}_preview1`} class={style.preview_image} />
                <div id={`${name}_preview2`} class={style.preview_image} />
              </Fragment>
            )}
          </div>

          <div hidden style={{ padding: '10px', margin: '10px 0', borderRadius: '20px' }}>
            <canvas id={`${name}_canvas`} style={{ background: 'linear-gradient(180deg, #f37516 0%, #2b0079 100%)', margin: '0 auto', display: 'block' }} />
          </div>

          {progress > 0 && <div class={style.progress}><div style={{ width: `${progress}%` }} /></div>}

          <FormButton label="Hochladen" disabled={!newImage || progress > 0} action={uploadImage} />

        </Fragment>
      </Popup>
      )}
    </Fragment>
  );
};

export default ImgInput;
