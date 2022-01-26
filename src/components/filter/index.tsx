import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import FormButton from '../form/basicButton';
import { Filter } from '../../interfaces/filter';
import FilterItem from './filterItem';

interface FilterListProps {
  data: Filter[][];
  values: string[];
}

const FilterList: FunctionalComponent<FilterListProps> = ({ data, values }: FilterListProps) => {
  const [activeSection, setActiveSection] = useState<string[]>(['we']);
  const [activeFilter, setActiveFilter] = useState<string[]>([]);

  useEffect(() => {
    if (activeFilter.length === 0 && values.length > 0) {
      const newActiveSection: string[] = [];
      values.forEach((x) => {
        const prefix = x.substring(0, 2);
        if (newActiveSection.indexOf(prefix) === -1) newActiveSection.push(prefix);
      });
      if (newActiveSection.length > 0) setActiveSection([...newActiveSection]);
      setActiveFilter(values);
    }
  }, [values]);

  const toggleTags = (tag: string, filterIndex: number, isRadio: boolean) => {
    let newFilter: string[] = activeFilter;

    if (filterIndex !== -1) {
      newFilter.splice(filterIndex, 1);
    } else {
      const prefix = tag.substring(0, 2);
      if (isRadio) newFilter = newFilter.filter((x) => !x.startsWith(prefix));
      if (tag !== prefix) newFilter.push(tag);
    }

    setActiveFilter([...newFilter]);
  };

  const activate = (sectionIndx: number, prefix: string) => {
    const newActiveSection = activeSection;
    if (sectionIndx !== -1) {
      newActiveSection.splice(sectionIndx);
      toggleTags(prefix, -1, true);
    } else {
      newActiveSection.push(prefix);
    }
    setActiveSection([...newActiveSection]);
  };

  const reset = async () => {
    setActiveSection([]);
    setActiveFilter([]);
  };

  return (
    <Fragment>
      {data.map((group: Filter[], groupIndex: number) => (
        <div key={groupIndex.toString()} style={{ backgroundColor: '#2b303d', borderRadius: '20px', marginBottom: '15px' }}>
          {group.map((item: Filter) => (
            <FilterItem
              filter={activeFilter}
              activate={activate}
              toggleTags={toggleTags}
              sectionIndx={activeSection.indexOf(item.title.form)}
              item={item}
            />
          ))}
        </div>
      ))}
      <FormButton label="Filter zurücksetzen" type="outline" action={() => reset()} />
    </Fragment>
  );
};

export default FilterList;
