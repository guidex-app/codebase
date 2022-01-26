import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Columns, DollarSign } from 'react-feather';
import BackButton from '../../../components/backButton';
import TextHeader from '../../../components/iconTextHeader';
import Item from '../../../components/item';
import Modal from '../../../container/modal';
import { getFireCollection } from '../../../data/fire';
import useCompany from '../../../hooks/useCompany';

import { Activity } from '../../../interfaces/activity';
import { ServiceField, ServiceInfo } from '../../../interfaces/company';
import EditPrices from './editPrices';

interface ActivityProp {
    activityID: string;
    activity: Activity;
    uid: string;
}

interface PriceListItem {
  title: string, id?: string, serviceType?: 'entry' | 'object' | 'roundGames';
}

const Prices: FunctionalComponent<ActivityProp> = ({ activity, activityID, uid }: ActivityProp) => {
  const data = useCompany(activityID, activity);
  if (!data || !uid) {
    return (
      <TextHeader
        icon={<Columns color="#bf5bf3" />}
        title="Preise definieren"
        text="Hier können sie die Preise definieren. Die Preise können auf Grundlage der Preis-Struktur angegeben werden. Sollte ein gewünschtes Feld nicht gefunden werden, passen sie bitte die Preis-Struktur an."
      />
    );
  }

  const [selected, setSelected] = useState<PriceListItem | false>(false);
  const [selectList, setSelectList] = useState<PriceListItem[] | false>(false);
  const [structure, setStructure] = useState<ServiceField[] | false>(false);

  const loadListData = () => {
    getFireCollection(`activities/${data.title.form}/services/`, false, [['structure', 'array-contains-any', ['serviceNames', 'persons', 'duration', 'foundation', 'time', 'age']]]).then((listData: ServiceInfo[]) => {
      if (listData) {
        const newList: PriceListItem[] = [];

        listData.forEach((l: ServiceInfo) => {
          if (l.serviceNames && l.serviceType && l.id) {
            const newItems: PriceListItem[] = l.serviceNames.map((name: string) => (
              { title: name, id: l.id, serviceType: l.serviceType }
            ));
            newList.push(...newItems);
            console.log(newItems);
          }
        });
        setSelectList(newList);
      }
    });
  };

  const loadStructure = () => {
    if (selected && selected.id) {
      getFireCollection(`activities/${data.title.form}/services/${selected.id}/structure`, false).then((structureList: ServiceField[]) => {
        if (structureList) setStructure(structureList);
      });
    }
  };

  const changeSelect = (value: string) => {
    setSelected(selectList ? selectList?.find((x: PriceListItem) => x.title === value) || false : false);
  };

  const closePrices = () => {
    setSelected(false);
    setStructure(false);
  };

  useEffect(() => { if (data.title.form) loadListData(); }, [data]);
  useEffect(() => { if (selected) loadStructure(); }, [selected]);

  return (
    <Fragment>
      <TextHeader
        icon={<Columns color="#bf5bf3" />}
        title="Preise definieren"
        text="Hier können sie die Preise definieren. Die Preise können auf Grundlage der Preis-Struktur angegeben werden. Sollte ein gewünschtes Feld nicht gefunden werden, passen sie bitte die Preis-Struktur an."
      />
      <main class="small_size_holder">
        <BackButton url={`/company/dashboard/${activityID}`} />
        {selectList !== false && (
        <section class="group form">
          <h3>Wähle eine Leistungsgruppe</h3>
          {!selectList?.[0] ? <p class="red">Definieren sie zuerst Ihre Rabatte</p>
            : selectList.map((x: PriceListItem) => <Item icon={<DollarSign />} key={x.title} label={x.title} action={() => changeSelect(x.title)} />)}
          <p class="grey">Sollte eine gewünschte Leistung nicht gefunden werden, schließen sie bitte zuerst die Preis-Struktur ab oder legen sie die Leistung neu an.</p>
        </section>
        )}

      </main>
      {selected && data.openings && selected && structure !== false && (
        <Modal title="Preise bearbeiten" close={closePrices} type="large">
          <EditPrices
            structure={structure}
            collection={`activities/${data.title.form}/services/${selected.id}`}
          />
        </Modal>
      )}
    </Fragment>
  );
};

export default Prices;
