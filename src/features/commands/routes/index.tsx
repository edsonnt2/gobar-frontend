import { Switch } from 'react-router-dom';

import Route from '@/routes/Route';

import { CloseCommandOrTable, RegisterProductInCommandOrTable } from '../pages';

const RoutesCommand: React.FC = () => {
  return (
    <Switch>
      <Route
        path="/business/command-or-table/register"
        component={RegisterProductInCommandOrTable}
        isPrivate
        isBusiness
      />
      <Route path="/business/command-or-table/close" component={CloseCommandOrTable} isPrivate isBusiness />
    </Switch>
  );
};

export default RoutesCommand;
