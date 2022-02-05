import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { replaceSpecialCharacters } from '../../../helper/string';
import useStorage from '../../../hooks/useStorage';
import Item from '../../item';
import style from './style.module.css';

interface ImgInputProps {
    label?: string,
    fileName: string,
    name: string,
    folderPath?: string,
    editAble?: true,
    error?: 'invalid' | 'error' | 'valid';
    size: [number, number],
    showSizeInfo?: true,
    startUpload: boolean,
    placeholder?: string,
    hasImage: boolean,
    uploadFinished?: (name: string) => void;
    change: (value: number, key: string) => void;
}

/**
 * Die Bilder werden in den Maßen (Width x Height)
 * Small: 250x200
 * Medium: 600x450
 * Large: 1200x900
 */
const ImgInput: FunctionalComponent<ImgInputProps> = ({ startUpload, change, uploadFinished, hasImage, size, error, fileName, editAble, folderPath, showSizeInfo, name, label = '*Thumbnail', placeholder = '+' }: ImgInputProps) => {
  const { state, progress, setUpload } = useStorage();
  const [newImage, setNewImage] = useState<File | Blob | undefined>();
  const [imgPosition, setImgPosition] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (fileName && folderPath && state !== 'loading' && !!newImage) setUpload({ file: newImage, fileName: replaceSpecialCharacters(fileName), folderPath });
  }, [startUpload, newImage]);

  useEffect(() => {
    if (progress === 1 && startUpload && uploadFinished) uploadFinished(name);
  }, [state]);

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

  const setUpCanvas = () => {
    const getFile: any = document.getElementById(`${name}_fileinput`);
    const file = getFile?.files?.[0];
    if (getFile && file) {
      const reader = new FileReader();

      reader.onloadend = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = () => {
          const canvas: any = document.getElementById(`${name}_canvas`);
          [canvas.width, canvas.height] = size;
          const ctx = canvas.getContext('2d');

          const widthRatio = canvas.width / image.width;
          const heightRatio = canvas.height / image.height;
          const ratio = Math.max(widthRatio, heightRatio);

          const centerShiftX = ((canvas.width - image.width * ratio) / 2) + (parseInt(imgPosition || '0', 10));
          const centerShiftY = (canvas.height - image.height * ratio) / 2;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0, image.width, image.height, centerShiftX, centerShiftY, image.width * ratio, image.height * ratio);
          const toBlob = dataURItoBlob(canvas.toDataURL('image/jpeg', { progressive: true }));
          change(toBlob?.size || 0, name);
          setNewImage(toBlob);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (imgPosition !== undefined && newImage) setUpCanvas();
  }, [imgPosition]);

  const getImageUrl = () => {
    const correctFileName = fileName && replaceSpecialCharacters(fileName);
    return `https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/${folderPath}%2F${correctFileName}%2F${correctFileName}_250x200`;
  };

  return (
    <div class={style.container}>
      <div class={error ? style[error] : ''}>
        <label for={`${name}_fileinput`}>{label}</label>

        <div>
          {hasImage && (
          <div class={style.image}>
            <picture>
              <source srcSet={`${getImageUrl()}.webp?alt=media`} type="image/webp" />
              <img loading="lazy" src={`${getImageUrl()}.jpeg?alt=media`} alt={label} />
            </picture>
          </div>
          )}

          <input
            type="file"
            accept="image/jpeg"
            className={style.fileinput}
            id={`${name}_fileinput`}
            placeholder={placeholder}
            onChange={() => setUpCanvas()}
          />
        </div>

        {showSizeInfo && <small>(Das Bild sollte mind. den maßen {size[0]}x{size[1]}px entsprechen)</small>}

        {newImage && editAble && (
          <Item label="Bild neu ausrichten" action={() => setImgPosition(imgPosition !== undefined ? undefined : '')} />
        )}

      </div>

      <div hidden={imgPosition === undefined} style={{ background: 'var(--ion-color-secondary)', padding: '10px', margin: '10px 0', borderRadius: '20px' }}>
        <input
          placeholder="z.B.: -20 (Horizontal)"
          type="text"
          value={imgPosition}
          spellCheck={false}
          onChange={(e: any) => {
            setImgPosition(e.target.value);
          }}
        />
        <canvas id={`${name}_canvas`} style={{ background: 'linear-gradient(180deg, #f37516 0%, #2b0079 100%)', margin: '0 auto', display: 'block' }} />
      </div>

      {error === 'error' && <small class={style.errorMessage}>Bitte mache eine korrekte eingabe</small>}

    </div>
  );
};

export default ImgInput;
