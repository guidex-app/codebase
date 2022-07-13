import { IconBorderAll, IconCalendar, IconEditCircle } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';

import Item from '../../../components/item';

interface ChangeStructureProps {
  unfinishedNr: number;
  dayGroups?: string[];
  openModal: (type: 'structure' | 'prices', day?: string) => void;
}

const ChangeStructure: FunctionalComponent<ChangeStructureProps> = ({ unfinishedNr, dayGroups, openModal }: ChangeStructureProps) => (
  <Fragment>
    <header style={{ padding: '0 15px' }}>
      <h1>Wähle eine Tagesgruppe</h1>
      <p style={{ color: 'var(--fifth)' }}>Um Ihre Preise zu definieren wird eine Struktur benötigt. Diese definiert die Rabatte und abweichungen. Definieren sie im nächsten Schritt diese Struktur. Oder wählen sie eine bereits vorhanden Struktur aus, wenn die Eigenschaften die gleichen sind und sich nur die jeweiligen Preise unterscheiden.</p>
    </header>

    {unfinishedNr <= 0 ? (
      <Item icon={<IconEditCircle />} type="grey" label="Struktur bearbeiten" text="Die Gruppen werden anhand der angegebenen Werte automatisch von Guidex generiert. Bei Änderungen werden schon angegbene Preise evtl. verworfen." action={() => openModal('structure')} />
    ) : (
      <Item icon={<IconBorderAll />} type="warning" label={`Fortfahren (noch ${unfinishedNr} Schritte)`} text="Sie müssen die Vorlage abschließen um fortzufahren" action={() => openModal('structure')} />
    )}

    {unfinishedNr <= 0 && dayGroups?.map((x) => <Item type="clean" icon={<IconCalendar color="#bf5bf3" />} editLabel="Mit Preiseingabe beginnen" label={x} action={() => openModal('prices', x)} />)}

    {/* <Item type="warning" label="Verwendete Tabelle entfernen" action={() => editStructure(undefined, 'belongs')} /> */}

  </Fragment>
);

export default ChangeStructure;
