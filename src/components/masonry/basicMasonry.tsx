import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { Cat } from '../../interfaces/categorie';
import Loading from './loading';
import MasonryItem from './masonryItem';
import style from './style.module.css';

interface BasicMasonryProps {
    list: Cat[] | false | undefined;
    type?: 'Voting' | 'Topic' | 'Geteilt' | 'Privat';
}

const BasicMasonry: FunctionalComponent<BasicMasonryProps> = ({ list, type }: BasicMasonryProps) => {
  const [chunks, setChunks] = useState<false | any[][] | undefined>(false);
  const generateChunks = () => {
    if (!list) return setChunks(undefined);

    const gen = [...Array(Math.ceil(list.length / 10))].map((_, i) => list.slice(10 * i, 10 + 10 * i));
    setChunks(gen);
  };

  useEffect(() => { generateChunks(); }, [list]);

  if (list === false || chunks === false) return <Loading />;
  return (
    <div class={style.masonryList}>
      {chunks?.map((item, index) => <MasonryItem chunks={chunks[index] || []} type={type} index={index} />)}
    </div>
  );
};

export default BasicMasonry;
