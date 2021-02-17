import { Switch } from 'react-router-dom';
import Route from '@/shared/routes/Route';
import RegisterBusiness from '../pages/RegisterBusiness';
import RegisterProductBusiness from '../pages/RegisterProductBusiness';
import RegisterTableBusiness from '../pages/RegisterTableBusiness';
import RegisterIngressBusiness from '../pages/RegisterIngressBusiness';

const RoutesBusiness: React.FC = () => {
  return (
    <Switch>
      <Route path="/business/register" component={RegisterBusiness} isPrivate />

      {/* Routes Business */}

      <Route path="/business/register-product" component={RegisterProductBusiness} isPrivate isBusiness />
      <Route path="/business/register-table" component={RegisterTableBusiness} isPrivate isBusiness />
      <Route path="/business/register-ingress" component={RegisterIngressBusiness} isPrivate isBusiness />
    </Switch>
  );
};

export default RoutesBusiness;
