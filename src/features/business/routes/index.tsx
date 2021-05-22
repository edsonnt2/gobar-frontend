import { Switch } from 'react-router-dom';

import Route from '@/routes/Route';

import { RegisterBusiness, StockBusiness, RegisterTableBusiness, RegisterEntranceBusiness } from '../pages';

const RoutesBusiness: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/business/register" component={RegisterBusiness} isPrivate />

      {/* Routes Business */}

      <Route path="/business/register/table" component={RegisterTableBusiness} isPrivate isBusiness />
      <Route path="/business/register/entrance" component={RegisterEntranceBusiness} isPrivate isBusiness />
      <Route path="/business/stock" component={StockBusiness} isPrivate isBusiness />
    </Switch>
  );
};

export default RoutesBusiness;
