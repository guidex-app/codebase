import { Fragment, FunctionalComponent, h } from 'preact';

import AppRoutes from './appRoutes';
import Menu from './menu';

const App: FunctionalComponent = () => (
  <Fragment>
    <main id="app" style={{ height: '100vh', overflowY: 'auto' }}>
      <Menu />
      <AppRoutes />
    </main>
    <div id="modals" />
    <div id="popups" />
  </Fragment>
);

export default App;
