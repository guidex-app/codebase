import { Fragment, FunctionalComponent, h } from 'preact';

import { Filter } from '../../interfaces/filter';
import Chip from '../chip';
import Item from '../item';

interface FilterProps {
  filter: string[]
  activate: (sectionIndx: number, prefix: string) => void;
  toggleTags: (newValue: string, filterIndex: number, isRadio: boolean) => void;
  sectionIndx: number;
  item: Filter;
}

const FilterItem: FunctionalComponent<FilterProps> = ({ filter, activate, toggleTags, sectionIndx, item }: FilterProps) => (
  <Fragment>
    <Item label={item?.title?.name} icon={item.title.icon} action={() => activate(sectionIndx, item.title.form)} />
    {sectionIndx !== -1 && (
    <section class="group" style={{ padding: '7.5px 10px', textAlign: 'center' }}>
      {item.data.map((data: { name: string, form: string }) => {
        const filterIndx = filter.indexOf(data.form);
        return <Chip key={data.form} label={data.name} type={filterIndx !== -1 ? 'active' : 'inactive'} action={() => toggleTags(data.form, filterIndx, item.inputType === 'radio')} />;
      })}
    </section>
    )}
  </Fragment>
);

export default FilterItem;
