import { IconLink } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';

import Item from '../../components/item';
import { ListCat } from '../../interfaces/list';

interface VotingViewProps {
  listId: string;
  winner?: ListCat[];
  voteItem?: string;
}

const VotingView: FunctionalComponent<VotingViewProps> = ({ winner, voteItem, listId }: VotingViewProps) => {
  const copyLink = () => {
    const el = document.createElement('textarea');
    el.value = listId;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <Item icon={<IconLink />} type="info" label="Verschicke den Link an Freunde" text="Dieses ist eine Voting-Liste, schicke den Link an Deine Freunde um sie abstimmen zu lassen." editLabel="Link kopieren" action={copyLink} />
      {winner ? winner.map((eachWin: ListCat, index: number) => (
        <Fragment>
          <Item
            image={`https://firebasestorage.googleapis.com/v0/b/guidex-95302.appspot.com/o/categories%2F${eachWin.title.form}%2F${eachWin.title.form}_600x450`}
            label={`Platz ${index + 1} - ${eachWin.title.name}`}
            text={eachWin.vote && eachWin.vote > 0 ? `${eachWin.vote} Votes` : 'Noch keine Votes vorhanden'}
          />
          {voteItem}
        </Fragment>
      )) : <Item type="warning" label="Es wurde noch kein Voting gemacht" />}
    </div>
  );
};

export default VotingView;
