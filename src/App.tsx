import { BrowserRouter as Router } from 'react-router-dom';

import Routes from '@/routes';
import GlobalStyle from '@/styles/global';
import ContextProvider from '@/hooks';

const App: React.FC = () => (
  <Router>
    <ContextProvider>
      <Routes />
    </ContextProvider>
    <GlobalStyle />
  </Router>
);

export default App;
