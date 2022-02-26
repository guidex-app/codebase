import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, increment, limit, orderBy, query, runTransaction, setDoc, startAt, updateDoc, where } from 'firebase/firestore/lite';

import fireConfig from './fireConfig';

const db = getFirestore(fireConfig);

// export const deleteStoragePath = (path:string) => {
//   const storageRef = fire.storage().ref();
//   const activityRef = storageRef.child(path);
//   activityRef.listAll().then((result) => {
//     result.items.forEach((file) => file.delete());
//   });
// };

const getQuery = (item: { path:string, order: string | false, w?: [string, 'array-contains' | 'array-contains-any' | '!=' | '==' | 'in' | '>' | 'not-in' | '>=' | '<=', any][], limited?: number, start?: (string | number)[] }) => {
  const whereFields = item.w?.map((i) => where(...i)) || [];
  return query(
    collection(db, item.path),
    ...(item.order ? [orderBy(item.order)] : []),
    ...(item.limited ? [limit(item.limited)] : []),
    ...(item.start?.[0] ? [startAt(...item.start)] : []),
    ...whereFields,
  );
};

// eslint-disable-next-line import/prefer-default-export
export const getFireCollection = async (path:string, order: string | false, whereField?: [string, 'array-contains' | 'array-contains-any' | '!=' | '==' | '>' | 'in' | '>=' | 'not-in' | '<=', any][], limited?: number, start?: (string | number)[]): Promise<any[]> => {
  const snapshot = await getDocs(getQuery({ path, order, w: whereField, limited, start }));
  return snapshot.docs.map((snap: any) => snap.data());
};

export const getFireDocument = async (path: string): Promise<any> => {
  const docRef = doc(db, path);
  const document = await getDoc(docRef);
  if (document.exists()) return document.data();
};

export const getFireMultiCollection = async (items: { path:string, isDocument?: true, where?: [string, 'array-contains' | '==' | 'in' | '>=' | '<=', any][] }[]): Promise<any> => (
  new Promise((resolve) => {
    Promise.all(items.map((item: any) => (item.isDocument
      ? getFireDocument(item.path)
      : getFireCollection(item.path, false, item.where))))
      .then((data: any[]) => {
        resolve(data);
      });
  })
);

export const fireDocument = async (path: string, fields: any, type: 'set' | 'update' | 'merge'): Promise<void> => {
  const docRef = doc(db, path);
  try {
    if (type === 'set') setDoc(docRef, fields);
    else updateDoc(docRef, fields);
  } catch (e) {
    console.log('Fehler:', path);
    console.error(`Error ${type} documument`, e);
  }
};

export const fireArray = async (path: string, fieldName: string, value: string, type: 'add' | 'remove'): Promise<void> => {
  fireDocument(path, { [fieldName]: type === 'add' ? arrayUnion(value) : arrayRemove(value) }, 'update');
};

export const deleteFireDocument = (path: string) => {
  const docRef = doc(db, path);
  deleteDoc(docRef);
};

export const setNewRating = async (activityId: string, uid: string, values: any, type: 'rating' | 'tipps', oldStarValue?: number) => {
  const activityPath = doc(db, `activities/${activityId}`);
  const ratingPath = doc(db, `activities/${activityId}/${type}/${uid}`);

  return runTransaction(db, async (transaction: any) => {
    const sfDoc = await transaction.get(activityPath);
    if (!sfDoc.exists()) return;

    transaction.set(ratingPath, values);
    if (type === 'rating' && values.rating) {
      const currentRating: number[] = sfDoc.data().rating || [0, 0, 0, 0, 0];

      if (oldStarValue !== 0) currentRating[(oldStarValue || 0) - 1] -= 1;
      currentRating[values.rating - 1] += 1;
      transaction.update(activityPath, { rating: currentRating });
    }
  });
};

export const voteItem = (mainPath: string, votePath: string, uid: string, commentUID: string, type: 'add' | 'remove', isRadio?: true) => {
  const itemVote = doc(db, `${mainPath}/${commentUID}`);
  const userVote = doc(db, `${votePath}/${uid}_${commentUID}`);

  return runTransaction(db, async (transaction: any) => {
    const sfDoc = await transaction.get(userVote);
    if (!sfDoc.exists() || (type === 'add' && isRadio && sfDoc.exists())) {
      if (isRadio) {
        const oldID = sfDoc.data()?.commentUID;
        const oldVote = doc(db, `${mainPath}/${oldID}`);
        if (oldID && oldID !== commentUID) transaction.update(oldVote, { vote: increment(-1) });
      }

      transaction.set(userVote, { vote: type === 'add' ? 1 : -1, uid, commentUID });
      transaction.update(itemVote, { vote: increment(type === 'add' ? 1 : -1) });
    } else {
      console.log('existiert');
      const currentVote: number = sfDoc.data()?.vote;

      if (currentVote !== (type === 'add' ? 1 : -1)) {
        transaction.delete(userVote);
        transaction.update(itemVote, { vote: increment(type === 'add' ? 1 : -1) });
      }
    }
  });
};

// export const partitions = () => {
//   getFireCollection('topics', false).then((data: any) => {
//     const batch: any = writeBatch(db);
//     console.log(data);

//     data.slice(51, 200).map((topic: any) => {
//       const nycRef = doc(db, `topics/${topic.title.form}`);

//       if (topic.partitions?.[0]?.indexOf('</br></br>') !== -1 && !topic.partitions?.[1]) {
//         const newPartitions: string[] = topic.partitions?.[0]?.split('</br></br>');
//         const newData = { partitions: newPartitions };
//         return batch.update(nycRef, newData);
//       }

//       return undefined;
//     });

//     batch.commit().then(() => {
//       console.log('fertig');
//     });
//   });
// };

// export const addSortNumber = () => {
//   getFireCollection('catInfos', false).then((data: any) => {
//     const batch: any = writeBatch(db);
//     console.log(data);

//     data.slice(0, 50).map((catInfo: any) => {
//       const nycRef = doc(db, `catInfos/${catInfo.title.form}`);

//       const newData = { sortCount: randomNumber(1, 7) };
//       return batch.update(nycRef, newData);
//     });

//     batch.commit().then(() => {
//       console.log('fertig');
//     });
//   });
// };

// export const saveGeohashes = () => {
//   // const allowed = ['u1x1', 'u1x3', 'u1x2', 'u1rr', 'u1rp', 'u1qz', 'u1wb', 'u1wc', 'u1x0'];
//   getFireCollection('catInfos', false).then((data: any) => {
//     const batch: any = writeBatch(db);
//     console.log(data);

//     const hashPath = doc(db, 'geo/u1x0');
//     batch.set(hashPath, { weather: ['Leichtes nieseln', new Date()], cityName: 'Hamburg', count: 51 });

//     data.slice(0, 51).map((catInfo: any) => {
//       ['u1x0'].map((hash: string) => {
//         const nycRef = doc(db, `geo/${hash}/categories/${catInfo.title.form}`);

//         const newData = {
//           ...catInfo,
//           count: Math.floor(Math.random() * (20 - 1 + 1)) + 1,
//         };
//         return batch.set(nycRef, newData);
//       });

//       return true;
//     });

//     batch.commit().then(() => {
//       console.log('fertig');
//     });
//   });
// };
