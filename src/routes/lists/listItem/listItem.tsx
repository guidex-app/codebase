import { FunctionalComponent, h } from 'preact';
import { Link } from 'preact-router';

import style from './style.module.css';

interface ListItemProps {
    item?: any,
}

const ListItem: FunctionalComponent<ListItemProps> = ({ item }: ListItemProps) => {
  const colorMap: { [key: string]: string } = { Rot: '#7c3747', Grün: '#34c359', Gelb: '#e7b442', Orange: '#e97537', Lila: '#632969', Blau: '#2c2567' };
  return (
    <Link class={style.listItem} href={`/lists/${item.title?.form}/`} key={item.title?.form} style={{ backgroundColor: colorMap[item.color] }}>
      <h3 className="ion-no-margin">{item.title.name}</h3>
      <small>({item.type})</small>
      {item.images?.map((catImg: string | false) => (
        catImg ? (
          <picture>
            <source srcSet={`https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/categories%2F${catImg}%2F${catImg}_250x200.webp?alt=media`} type="image/webp" />
            <img src={`https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/categories%2F${catImg}%2F${catImg}_250x200.jpeg?alt=media`} alt={item.title?.name} />
          </picture>
        ) : <div />
      ))}
    </Link>
  );
};

export default ListItem;
