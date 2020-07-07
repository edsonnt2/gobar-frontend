import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import RegisterBusiness from '../pages/RegisterBusiness';
import RegisterProductBusiness from '../pages/RegisterProductBusiness';
import RegisterTableBusiness from '../pages/RegisterTableBusiness';
import RegisterIngressBusiness from '../pages/RegisterIngressBusiness';
import FindCustomer from '../pages/FindCustomer';
import RegisterCustomer from '../pages/RegisterCustomer';
import Customer from '../pages/Customer';
import RegisterCommandOrTable from '../pages/RegisterCommandOrTable';

const Routes: React.FC = () => {
  return (
    <Switch>
      {/* Routes Initial */}
      <Route exact path="/" component={SignIn} />
      <Route path="/signup" component={SignUp} />

      {/* Routes User */}
      <Route path="/dashboard" component={Dashboard} isPrivate />

      <Route path="/business/register" component={RegisterBusiness} isPrivate />

      {/* Routes Business */}
      <Route
        exact
        path="/business"
        component={FindCustomer}
        isPrivate
        isBusiness
      />
      <Route
        exact
        path="/business/register-customer"
        component={RegisterCustomer}
        isPrivate
        isBusiness
      />
      <Route
        path="/business/register-customer/:id"
        component={RegisterCustomer}
        isPrivate
        isBusiness
      />
      <Route
        path="/business/customer/:id"
        component={Customer}
        isPrivate
        isBusiness
      />
      <Route
        path="/business/register-product"
        component={RegisterProductBusiness}
        isPrivate
        isBusiness
      />
      <Route
        path="/business/register-table"
        component={RegisterTableBusiness}
        isPrivate
        isBusiness
      />
      <Route
        path="/business/register-ingress"
        component={RegisterIngressBusiness}
        isPrivate
        isBusiness
      />

      <Route
        path="/business/register-command-or-table"
        component={RegisterCommandOrTable}
        isPrivate
        isBusiness
      />
    </Switch>
  );
};

export default Routes;
