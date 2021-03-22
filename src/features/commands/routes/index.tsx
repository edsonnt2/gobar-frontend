import { Switch } from 'react-router-dom';

import Route from '@/routes/Route';

import { CloseCommandOrTable, RegisterProductInCommandOrTable } from '../pages';

const RoutesCommand: React.FC = () => {
  return (
    <Switch>
      <Route
        path="/business/register-command-or-table"
        component={RegisterProductInCommandOrTable}
        isPrivate
        isBusiness
      />
      <Route path="/business/close-command-or-table" component={CloseCommandOrTable} isPrivate isBusiness />
    </Switch>
  );
};

export default RoutesCommand;
