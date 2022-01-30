import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { GitBranch, PlusCircle } from 'react-feather';
import Item from '../../../components/item';
import { getFireCollection } from '../../../data/fire';

import { Structure } from '../../../interfaces/company';

interface ChangeStructureProps {
    activityID: string;
    serviceID: string;
    select: (structureID?: number) => void;
}

const ChangeStructure: FunctionalComponent<ChangeStructureProps> = ({ activityID, serviceID, select }: ChangeStructureProps) => {
  const [structureList, setStructureList] = useState<Structure[]>([]);

  /** Lade alle services von der activity ID */
  const getServiceStructures = async () => {
    const serviceFieldData = await getFireCollection(`activities/${activityID}/structures`, false);
    setStructureList(serviceFieldData);
  };

  useEffect(() => { getServiceStructures(); }, []);

  return (
    <Fragment>
      <h1>Preis-Vorlage auswählen</h1>
      <p class="grey">Um Ihre Preise zu definieren wird eine Struktur benötigt. Diese definiert die Rabatte und abweichungen. Definieren sie im nächsten Schritt diese Struktur. Oder wählen sie eine bereits vorhanden Struktur aus, wenn die Eigenschaften die gleichen sind und sich nur die jeweiligen Preise unterscheiden.</p>

      <section class="group form" style={{ marginTop: '20px' }}>
        <Item icon={<PlusCircle />} label="Neue Vorlage anlegen" type="grey" action={() => select(undefined)} />

        {structureList?.[0] && (
        <Fragment>
          <h4 style={{ backgroundColor: '#2f2938', padding: '5px 20px', margin: '20px -15px 15px -15px', fontSize: '17px' }}>Vorlagen übernehmen</h4>

          {structureList?.map((x: Structure) => (
            <Item icon={<GitBranch color="#63e6e1" />} type={x.services?.includes(serviceID) ? 'grey' : undefined} label={`Verwendet von: ${x.services?.toString() || 'test'}`} text={x.description} action={() => select(x.id)} />
          ))}
        </Fragment>
        )}

      </section>
    </Fragment>
  );
};

export default ChangeStructure;
