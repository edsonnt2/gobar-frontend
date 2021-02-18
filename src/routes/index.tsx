import RoutesUser from '@/features/users/routes';
import RoutesBusiness from '@/features/business/routes';
import RoutesCustomer from '@/features/customers/routes';
import RoutesCommand from '@/features/commands/routes';

const Routes: React.FC = () => {
  return (
    <>
      <RoutesUser />
      <RoutesBusiness />
      <RoutesCustomer />
      <RoutesCommand />
    </>
  );
};

export default Routes;
