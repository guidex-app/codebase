import { getFirestore, collection, getDocs, query, limit, updateDoc, doc, setDoc, where, startAt, getDoc, runTransaction, increment, writeBatch } from 'firebase/firestore/lite';
import fireConfig from './fireConfig';

const db = getFirestore(fireConfig);

// export const deleteStoragePath = (path:string) => {
//   const storageRef = fire.storage().ref();
//   const activityRef = storageRef.child(path);
//   activityRef.listAll().then((result) => {
//     result.items.forEach((file) => file.delete());
//   });
// };

const getQuery = (item: { path:string, order: string | false, w?: [string, 'array-contains' | 'array-contains-any' | '!=' | '==' | 'in' | '>' | '>=' | '<=', any][], limited?: number, start?: (string | number)[] }) => {
  const whereFields = item.w?.map((i) => where(...i)) || [];
  return query(
    collection(db, item.path),
    ...(item.limited ? [limit(item.limited)] : []),
    ...(item.start?.[0] ? [startAt(...item.start)] : []),
    ...whereFields,
  );
};

// eslint-disable-next-line import/prefer-default-export
export const getFireCollection = async (path:string, order: string | false, whereField?: [string, 'array-contains' | 'array-contains-any' | '!=' | '==' | '>' | 'in' | '>=' | '<=', any][], limited?: number, start?: (string | number)[]): Promise<any[]> => {
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

export const fireDocument = async (path: string, fields: any, type: 'set' | 'update'): Promise<void> => {
  const docRef = doc(db, path);
  try {
    if (type === 'set') setDoc(docRef, fields);
    else updateDoc(docRef, fields);
  } catch (e) {
    console.log('Fehler:', path);
    console.error(`Error ${type} documument`, e);
  }
};

// export const deleteFireDocument = (collection: string, documentId: string) => {
//   collection(db, collection).doc(documentId).delete();
// };

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
