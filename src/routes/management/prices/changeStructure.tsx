import { Fragment, FunctionalComponent, h } from 'preact';
import { AlignJustify } from 'react-feather';

import Item from '../../../components/item';

interface ChangeStructureProps {
    select: (structureID?: number) => void;
}

const ChangeStructure: FunctionalComponent<ChangeStructureProps> = ({ select }: ChangeStructureProps) => (
  <Fragment>
    <h1>Preis-Tabelle konfigurieren</h1>
    <p style={{ color: 'var(--fifth)' }}>Um Ihre Preise zu definieren wird eine Struktur benötigt. Diese definiert die Rabatte und abweichungen. Definieren sie im nächsten Schritt diese Struktur. Oder wählen sie eine bereits vorhanden Struktur aus, wenn die Eigenschaften die gleichen sind und sich nur die jeweiligen Preise unterscheiden.</p>
    <Item icon={<AlignJustify color="var(--orange)" />} label="Neue Preis-Tabelle anlegen" type="info" action={() => select(undefined)} />
    {/*
    <section class="group form" style={{ marginTop: '20px' }}>
      {structureList?.map((x: Structure) => (
        <Item icon={<GitBranch color={x.services?.[0] ? '#fea00a' : undefined} />} type={x.services?.includes(serviceID) ? 'grey' : undefined} label={x.services?.[0] ? `Verwendet von: ${x.services?.join(' & ')}` : 'Wird nicht verwendet'} text={x.description} action={() => select(x.id)} />
      ))}
    </section> */}

  </Fragment>
);

export default ChangeStructure;
