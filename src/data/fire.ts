import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, increment, limit, orderBy, query, runTransaction, setDoc, startAt, updateDoc, where, writeBatch } from 'firebase/firestore/lite';

import { randomNumber } from '../helper/array';
import { generateDateString } from '../helper/date';
import { Activity } from '../interfaces/activity';
import { CatInfo } from '../interfaces/categorie';
import { Reservation, ReservationSlot } from '../interfaces/reservation';
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
export const getFireCollection = async (path:string, order: string | false, whereField?: [string, 'array-contains' | 'array-contains-any' | '!=' | '==' | '>' | 'in' | '>=' | 'not-in' | '<=', any][], limited?: number, start?: (string | number)[]): Promise<any[] | undefined> => {
  const snapshot = await getDocs(getQuery({ path, order, w: whereField, limited, start }));
  if (!snapshot.docs[0]) return undefined;
  return snapshot.docs.map((snap: any) => snap.data());
};

export const getFireDocument = async (path: string): Promise<any> => {
  const docRef = doc(db, path);
  const document = await getDoc(docRef);
  return document.exists() ? document.data() : undefined;
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

export const setActivityOnline = (activityId: string, location: ('lo_indoor' | 'lo_outdoor' | string)[], categorie: string) => {
  const geohash = ['u1x4', 'u1x6', 'u1x3', 'u1x2', 'u1x0', 'u1wb', 'u1wc', 'u1wf', 'u1x1'];

  const generateHashRef = (hash: string) => doc(db, `geo/${hash}/categories/${categorie}`);

  getFireDocument(`activities/${activityId}`).then(async (actData: Activity) => {
    let counter = 0;
    if (!actData?.state?.includes('online')) {
      // IST NICHT ONLINE
      getFireDocument(`catInfos/${categorie}`).then((catData: CatInfo) => {
        // set activity online
        const batch: any = writeBatch(db);

        batch.update(doc(db, `activities/${activityId}`), { state: arrayUnion('online') });

        // update geohashes
        const clearFilter = catData.filter.filter((x) => !x.startsWith('lo_'));
        const filter = [...clearFilter, ...location];

        geohash.map((hash: string) => {
          // update cat in hash
          counter += 1;

          return batch.set(generateHashRef(hash), { title: catData.title, description: catData.description, filter, sortCount: randomNumber(1, 7), count: { indoor: increment(location.includes('lo_indoor') ? 1 : 0), outdoor: increment(location.includes('lo_outdoor') ? 1 : 0) } }, { merge: true });
        });
        batch.commit().then(() => { console.log('Activity is now online'); });
      });
    } else {
      // IST SCHON ONLINE
      try {
        await runTransaction(db, async (transaction) => {
          const hashInfos: any[] = await Promise.all(geohash.map(async (hash: string) => {
            const hashRef: any = doc(db, `geo/${hash}/categories/${categorie}`);

            const getHash: any = await transaction.get(hashRef);
            const { count, filter } = getHash.data();
            counter += 1;

            return { hash, count, filter };
          }));

          console.log('hashInfos', hashInfos);

          await Promise.all(geohash.map(async (hash: string) => {
            // update cat in hash

            const findHash = hashInfos.find((x) => x.hash === hash);
            if (!findHash) return;

            const { count, filter } = findHash;
            const newCount = {
              indoor: count.indoor - (location.includes('lo_indoor') ? 1 : 0),
              outdoor: count.outdoor - (location.includes('lo_outdoor') ? 1 : 0),
            };

            if (newCount.indoor <= 0 && newCount.outdoor <= 0) {
              transaction.delete(generateHashRef(hash));
              counter += 1;
            } else {
              // filter nur entfernen wenn der count 1 bzw unter 1 ist
              const newFilter: any = filter.filter((x: string) => !x.startsWith('lo_') || location.includes(x));

              transaction.update(generateHashRef(hash), { count: newCount, filter: newFilter });
              counter += 1;
            }

            transaction.update(doc(db, `activities/${activityId}`), { state: arrayRemove('online') });
          }));
        });
      } catch (e) {
        console.log('fehler beim offline stellen', e);
      } finally {
        console.log('Transaction successfully committed!', counter);
      }
    }
  });
};

export const reserve = (servicePath?: string, data?: Reservation) => {
  if (servicePath && data && data.totalPrice && data.startTime && data.uid) {
    const reservationPath = doc(db, `${servicePath}/reservations/${data.reservationId}`);
    const slotPath = doc(db, `${servicePath}/reserved/${data.startTime}_${data.date[0]}`);

    const dateString = generateDateString(data.date[0]);
    const slot: ReservationSlot = { date: dateString, startTime: data.startTime, personAmount: increment(data.personAmount) };

    return runTransaction(db, async (transaction: any) => {
      const sfDoc = await transaction.get(slotPath);

      transaction.set(reservationPath, data);

      if (sfDoc.exists()) {
        transaction.update(slotPath, slot);
      } else {
        transaction.set(slotPath, {
          date: dateString,
          startTime: data.startTime,
          personAmount: data.personAmount,
          rooms: data.rooms,
        });
      }

      return Promise.resolve('reserviert');
    });
  }
};

export const reservStorno = (servicePath?: string, reservationId?: string, slotId?: string, personAmount?: number) => {
  if (servicePath && reservationId && slotId && personAmount) {
    const reservationPath = doc(db, `${servicePath}/reservations/${reservationId}`);
    const slotPath = doc(db, `${servicePath}/reserved/${slotId}`);

    return runTransaction(db, async (transaction: any) => {
      const sfDoc = await transaction.get(slotPath);

      transaction.delete(reservationPath);

      if (sfDoc.exists()) {
        transaction.update(slotPath, { personAmount: increment(-personAmount) });
      }

      return Promise.resolve('reserviert');
    });
  }
};
