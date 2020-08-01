import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from '~/shared/routes';
import GlobalStyle from '~/shared/styles/global';
import ContextProvider from '~/shared/hooks';

const App: React.FC = () => (
  <Router>
    <ContextProvider>
      <Routes />
    </ContextProvider>
    <GlobalStyle />
  </Router>
);

export default App;
