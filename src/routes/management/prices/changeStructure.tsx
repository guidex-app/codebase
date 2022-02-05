import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { GitBranch, PlusCircle } from 'react-feather';

import CheckInput from '../../../components/form/checkInput';
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
  const [other, setOther] = useState<boolean>(false);

  /** Lade alle services von der activity ID */
  const getServiceStructures = async () => {
    const serviceFieldData = await getFireCollection(`activities/${activityID}/structures`, false);
    setStructureList(serviceFieldData);
  };

  useEffect(() => { getServiceStructures(); }, []);

  console.log(serviceID);
  return (
    <Fragment>
      <h1>Preis-Vorlage auswählen</h1>
      <p class="grey">Um Ihre Preise zu definieren wird eine Struktur benötigt. Diese definiert die Rabatte und abweichungen. Definieren sie im nächsten Schritt diese Struktur. Oder wählen sie eine bereits vorhanden Struktur aus, wenn die Eigenschaften die gleichen sind und sich nur die jeweiligen Preise unterscheiden.</p>
      <Item icon={<PlusCircle />} label="Neue Vorlage anlegen" type="info" action={() => select(undefined)} />
      <CheckInput name="" label="Vorhandene Vorlage von anderen Leistungen übernehmen" change={() => setOther(!other)} />

      {other && (
      <section class="group form" style={{ marginTop: '20px' }}>
        {structureList?.[0] && (

          structureList?.map((x: Structure) => (
            <Item icon={<GitBranch color={x.services?.[0] ? '#fea00a' : undefined} />} type={x.services?.includes(serviceID) ? 'grey' : undefined} label={x.services?.[0] ? `Verwendet von: ${x.services?.join(' & ')}` : 'Wird nicht verwendet'} text={x.description} action={() => select(x.id)} />
          ))

        )}
      </section>
      )}
    </Fragment>
  );
};

export default ChangeStructure;
