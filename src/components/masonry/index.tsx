import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import Loading from './loading';
import VirtualScroll from './virtualScroll';

interface MasonryProps {
    list: any[];
    type?: 'Voting' | 'Topic' | 'Geteilt' | 'Privat';
}

const Masonry: FunctionalComponent<MasonryProps> = ({ list, type }: MasonryProps) => {
  const [chunks, setChunks] = useState<any[][]>();

  const generateChunks = () => {
    const listLength = list.length;
    if (listLength > 0) {
      const gen = [...Array(Math.ceil(listLength / 10))].map((_, i) => list.slice(10 * i, 10 + 10 * i));
      setChunks(gen);
    }
  };

  useEffect(() => { generateChunks(); }, [list]);

  return chunks ? <VirtualScroll chunks={chunks} type={type} /> : <Loading />;
};

export default Masonry;
