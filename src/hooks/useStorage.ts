import { getAuth } from '@firebase/auth';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useEffect, useState } from 'preact/hooks';

import fireConfig from '../data/fireConfig';

const useStorage = (): { progress: number, setUpload: (img: { file: File | Blob, fileName: string, folderPath: string }) => void } => {
  getAuth(fireConfig);
  const storage = getStorage(fireConfig);

  // sets properties on the file to be uploaded
  const [upload, setUpload] = useState<{ file: File | Blob, fileName: string, folderPath: string } | undefined>(undefined);

  const [progress, setProgress] = useState<number>(0);

  const uploadData = () => {
    if (storage && upload?.file) {
      console.log('Image-Upload started', upload?.file);
      const { folderPath, fileName, file } = upload;
      // const metadata = { cacheControl: 'public,max-age=300', contentType: 'image/jpeg' };

      const storageRef = ref(storage, `${folderPath}/${fileName}/${fileName}.jpg`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', (snapshot) => {
        const progr = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progr);
        console.log(`Upload is ${progr}% done`);
      }, () => {
        setProgress(0);
      }, () => {
        console.log('File available at', `${folderPath}/${fileName}/${fileName}.jpeg`);
        setProgress(-1);
      });
    } else {
      console.log('Kein Storage oder kein file', upload?.file);
    }
  };

  useEffect(() => {
    if (upload?.file) uploadData();
  }, [upload]);

  return {
    progress,
    setUpload,
  };
};

export default useStorage;
