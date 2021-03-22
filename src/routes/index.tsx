import { RoutesBusiness, RoutesCommand, RoutesCustomer, RoutesUser } from '@/features';

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
