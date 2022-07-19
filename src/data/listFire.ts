import { doc, getFirestore, writeBatch } from 'firebase/firestore/lite';

import { List } from '../interfaces/list';
import fireConfig from './fireConfig';

const db = getFirestore(fireConfig);

export const addCatToList = (listItem: List, cat: { name: string, form: string }) => {
  const batch: any = writeBatch(db);
  const images = listItem.images.includes(cat.form) ? listItem.images : [cat.form, listItem.images[0], listItem.images[1]];
  batch.update(doc(db, `lists/${listItem.title.form}_${listItem.uid}`), { images });
  batch.set(doc(db, `lists/${listItem.title.form}_${listItem.uid}/cats/${cat.form}`), { title: cat, vote: 0 });

  batch.commit().then(() => { console.log('Liste wurde aktualisiert'); });
};

export const voteListItem = () => {
  console.log('vote');
};
