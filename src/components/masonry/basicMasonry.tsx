import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { Cat } from '../../interfaces/categorie';
import Loading from './loading';
import MasonryItem from './masonryItem';

interface BasicMasonryProps {
    list: Cat[] | false | undefined;
    link?: 'explore' | 'activity';
}

const BasicMasonry: FunctionalComponent<BasicMasonryProps> = ({ list, link }: BasicMasonryProps) => {
  const [chunks, setChunks] = useState<false | any[][] | undefined>(false);
  const generateChunks = () => {
    if (!list) return setChunks(undefined);

    const gen = [...Array(Math.ceil(list.length / 10))].map((_, i) => list.slice(10 * i, 10 + 10 * i));
    setChunks(gen);
  };

  useEffect(() => { generateChunks(); }, [list]);

  if (list === false || chunks === false) return <Loading />;
  return (
    <Fragment>
      {chunks?.map((item, index) => <MasonryItem chunks={item} link={link} index={index} />)}
      <div />
    </Fragment>
  );
};

export default BasicMasonry;
