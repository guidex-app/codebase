import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import Loading from './loading';
import VirtualScroll from './virtualScroll';

interface MasonryProps {
    items: any[];
    type?: 'Voting' | 'Topic' | 'Geteilt' | 'Privat';
    // voteItem?: string;
    // eslint-disable-next-line no-unused-vars
    // vote?: (itemForm: string, isVotet?: boolean) => void;
    // hideIcon?: boolean;
}

const Masonry: FunctionalComponent<MasonryProps> = ({ items, type }: MasonryProps) => {
  const [chunks, setChunks] = useState<any[][]>([]);

  const generateChunks = (arr: any[], size: number): any[][] => (
    [...Array(Math.ceil(arr.length / size))].map((_, i) => arr.slice(size * i, size + size * i))
  );

  useEffect(() => {
    if (items?.[0]) setChunks(generateChunks(items, 10));
  }, [items]);

  return chunks?.[0] ? <VirtualScroll chunks={chunks} type={type} /> : <Loading />;
};

export default Masonry;
