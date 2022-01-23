import { FunctionalComponent, h } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import MasonryItem from './masonryItem';
import style from './style.module.css';

interface VirtualScrollProps {
    chunks: any[][];
    type?: 'Voting' | 'Topic' | 'Geteilt' | 'Privat';
}

const VirtualScroll: FunctionalComponent<VirtualScrollProps> = ({ chunks, type }: VirtualScrollProps) => {
  const MAX_ITEMS: number = chunks.length;
  const VISIBLE_ITEMS = 3;
  const containerEl: any = document.getElementById('app');

  const elementRef: any = useRef(null);
  const [offset, setOffset] = useState({ gap: 0, elHeight: 0 });
  const [scrolling, setScrolling] = useState<{ startAt: number, offsetY: number }>({ startAt: -1, offsetY: -1 });

  const setUpScrolling = (scrolled: number) => {
    const startAt = Math.max(0, Math.floor((scrolled - offset.gap) / offset.elHeight));
    const offsetY = startAt * offset.elHeight;

    setScrolling({ startAt, offsetY });
  };

  const onScroll = (e: any) => requestAnimationFrame(() => {
    setUpScrolling(e.target.scrollTop);
  });

  useEffect(() => {
    const { offsetTop, offsetHeight }: { offsetTop: number, offsetHeight: number } = elementRef.current;
    setOffset({ gap: offsetTop + 1, elHeight: Math.ceil(offsetHeight / VISIBLE_ITEMS) });
  }, []);

  useEffect(() => {
    if (scrolling.startAt === -1 && offset.gap) {
      setUpScrolling(0);
      containerEl.addEventListener('scroll', onScroll);
    }
    return () => containerEl.removeEventListener('scroll', onScroll);
  }, [offset]);

  const visibleChildren = useMemo(() => new Array(VISIBLE_ITEMS).fill(null).map((_, index) => (
    <div key={`${index.toString()}_${scrolling.startAt}`} class={`${style.chunk} ${(index + scrolling.startAt) % 2 === 0 ? 'even' : 'odd'}`}>
      <MasonryItem chunks={chunks[index + scrolling.startAt] || []} type={type} />
    </div>
  )), [scrolling.startAt]);

  return (
    <div
      class={style.masonryList}
      ref={elementRef}
      style={{
        overflow: 'hidden',
        willChange: 'transform',
        height: offset.elHeight ? `${offset.elHeight * MAX_ITEMS}px` : 'auto',
        position: 'relative',
      }}
    >
      <div
        style={{
          willChange: 'transform',
          transform: `translateY(${scrolling.offsetY}px)`,
        }}
      >
        {visibleChildren}
      </div>
    </div>
  );
};

export default VirtualScroll;
