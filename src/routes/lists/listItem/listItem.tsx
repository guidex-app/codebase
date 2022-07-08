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
      <div>
        <h2>
          {item.title?.name}&nbsp;
        </h2>
      </div>
    </Link>
  );
};

export default ListItem;
