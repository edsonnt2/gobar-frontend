import { Switch } from 'react-router-dom';

import Route from '@/routes/Route';

import { Dashboard, SignIn, SignUp } from '../pages';

const RoutesUser: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/dashboard" component={Dashboard} isPrivate />
    </Switch>
  );
};

export default RoutesUser;
