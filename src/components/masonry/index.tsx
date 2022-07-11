import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { Cat } from '../../interfaces/categorie';
import Item from '../item';
import Loading from './loading';
import VirtualScroll from './virtualScroll';

interface MasonryProps {
    list: Cat[] | false | undefined;
    link?: 'explore' | 'activity';
}

const Masonry: FunctionalComponent<MasonryProps> = ({ list, link }: MasonryProps) => {
  const [chunks, setChunks] = useState<any[][]>([]);

  const loading = <Loading />;

  if (list === false) return loading;

  const generateChunks = () => {
    const listLength = list ? list.length : 0;
    if (list && listLength > 0) {
      const gen = [...Array(Math.ceil(listLength / 10))].map((_, i) => list.slice(10 * i, 10 + 10 * i));
      setChunks(gen);
    }
  };

  useEffect(() => { generateChunks(); }, [list]);

  if (list === undefined) return <Item type="info" label="Es wurde nichts gefunden" />;
  return <VirtualScroll chunks={chunks} link={link} />;
};

export default Masonry;
