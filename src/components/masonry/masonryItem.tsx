/* eslint-disable react/prop-types */
import { h } from 'preact';
import { Link } from 'preact-router';

import style from './style.module.css';

// interface MasonryItemProps {
//   chunks: (Cat | Topic)[];
//   // eslint-disable-next-line no-unused-vars
//   // action?: (form: string) => void;
//   type?: 'Voting' | 'Topic' | 'Geteilt' | 'Privat';
//   // specs?: string;
//   // isVotet?: boolean;
//   // hideIcon?: boolean;
// }

function MasonryItem({ chunks, type }: any) {
  //   const getVotingIcon = () => (isVotet ? caretDownCircleOutline : caretUpCircleOutline);
  const getPath = (form: string) => `https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/${type !== 'Topic' ? 'categories' : 'topics'}%2F${form}%2F${form}_600x450`;

  return (

    chunks.map((item: any, itemIndex: number) => (
      <div class={style[`item_${itemIndex}`]}>
        <Link href={`/${type !== 'Topic' ? 'activity' : 'explore'}/${item.title?.form}?l=o`}>
          <picture>
            <source srcSet={`${getPath(item.title?.form)}.webp?alt=media`} type="image/webp" />
            <img loading="lazy" src={`${getPath(item.title?.form)}.jpeg?alt=media`} alt={item.title?.name} />
          </picture>
        </Link>
        <strong>{item.title?.name} {item.count ? `(${item.count.indoor + item.count.outdoor})` : ''}</strong>
        {/* {!hideIcon && type !== 'Topic' && <IonIcon icon={type !== 'Voting' ? bookmarkOutline : getVotingIcon()} slot="end" size={type !== 'Voting' ? 'small' : 'large'} color={!isVotet ? 'danger' : 'success'} onClick={() => action(cat.title.name)} />} */}
      </div>
    ))

  );
}

export default MasonryItem;
