import { getAuth } from '@firebase/auth';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useEffect, useState } from 'preact/hooks';
import fireConfig from '../data/fireConfig';

const useStorage = (): { state: 'loading' | 'error' | 'waiting', progress: number, setUpload: (img: { file: File | Blob, fileName: string, folderPath: string }) => void } => {
  getAuth(fireConfig);
  const storage = getStorage(fireConfig);

  // sets properties on the file to be uploaded
  const [upload, setUpload] = useState<{ file: File | Blob, fileName: string, folderPath: string } | undefined>(undefined);

  // if we are loading a file or not
  const [state, setState] = useState<'loading' | 'error' | 'waiting'>('waiting');
  const [progress, setProgress] = useState<number>(0);

  const uploadData = () => {
    if (storage && upload?.file) {
      console.log('Image-Upload started', upload?.file);
      const { folderPath, fileName, file } = upload;
      // const metadata = { cacheControl: 'public,max-age=300', contentType: 'image/jpeg' };

      const storageRef = ref(storage, `${folderPath}/${fileName}/${fileName}.jpg`);

      setState('loading');

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', (snapshot) => {
        const progr = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progr);
        console.log(`Upload is ${progress}% done`);
      }, (error) => {
        setState('error');
        setProgress(0);
      }, () => {
        console.log('File available at', `${folderPath}/${fileName}/${fileName}.jpeg`);
        setProgress(1);
        setState('waiting');
      });
    } else {
      setState('error');
      console.log('Kein Storage oder kein file', upload?.file);
    }
  };

  useEffect(() => {
    if (upload?.file) uploadData();
  }, [upload]);

  return {
    state,
    progress,
    setUpload,
  };
};

export default useStorage;
