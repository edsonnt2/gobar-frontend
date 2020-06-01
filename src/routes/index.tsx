import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import RegisterBusiness from '../pages/RegisterBusiness';
import RegisterProductBusiness from '../pages/RegisterProductBusiness';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/dashboard" component={Dashboard} isPrimave />
      <Route path="/register-business" component={RegisterBusiness} isPrimave />
      <Route
        path="/register-product-business"
        component={RegisterProductBusiness}
        isPrimave
      />
    </Switch>
  );
};

export default Routes;
