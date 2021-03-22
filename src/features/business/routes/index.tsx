import { Switch } from 'react-router-dom';

import Route from '@/routes/Route';

import { RegisterBusiness, RegisterProductBusiness, RegisterTableBusiness, RegisterEntranceBusiness } from '../pages';

const RoutesBusiness: React.FC = () => {
  return (
    <Switch>
      <Route path="/business/register" component={RegisterBusiness} isPrivate />

      {/* Routes Business */}

      <Route path="/business/register-product" component={RegisterProductBusiness} isPrivate isBusiness />
      <Route path="/business/register-table" component={RegisterTableBusiness} isPrivate isBusiness />
      <Route path="/business/register-entrance" component={RegisterEntranceBusiness} isPrivate isBusiness />
    </Switch>
  );
};

export default RoutesBusiness;
