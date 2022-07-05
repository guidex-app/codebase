import { Fragment, FunctionalComponent, h } from 'preact';

import AppRoutes from './appRoutes';

const App: FunctionalComponent = () => (
  <Fragment>
    <main id="app">
      <AppRoutes />
    </main>
    <div id="modals" />
    <div id="popups" />
  </Fragment>
);

export default App;
