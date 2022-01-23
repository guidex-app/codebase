import { FunctionalComponent, h } from 'preact';
import style from './style.module.css';

interface FilterBarProps {
    link?: string;
    title?: string;
    fixed?: true;
    isClose?: true;
    action?: () => void;
}

const FilterBar: FunctionalComponent<FilterBarProps> = () => (
  <section class={style.filterBar} />
);

export default FilterBar;
