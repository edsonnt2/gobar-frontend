import { Switch } from 'react-router-dom';

import Route from '@/routes/Route';

import { FindCustomer, RegisterCustomer, Customer } from '../pages';

const RoutesCustomer: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/business" component={FindCustomer} isPrivate isBusiness />
      <Route exact path="/business/register-customer" component={RegisterCustomer} isPrivate isBusiness />
      <Route path="/business/register-customer/:id" component={RegisterCustomer} isPrivate isBusiness />
      <Route path="/business/customer/:id" component={Customer} isPrivate isBusiness />
    </Switch>
  );
};

export default RoutesCustomer;
