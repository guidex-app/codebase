import { FunctionalComponent, h } from 'preact';
import { Link } from 'preact-router/match';

import style from './style.css';

const Notfound: FunctionalComponent = () => (
  <div class={style.notfound}>
    <h1>Error 404</h1>
    <p>Diese Seite existiert nicht</p>
    <Link href="/">
      <h4>Zurück zur Startseite</h4>
    </Link>
  </div>
);

export default Notfound;
