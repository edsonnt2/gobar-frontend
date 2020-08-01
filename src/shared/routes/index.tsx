import React from 'react';
import RoutesUser from '~/modules/users/routes';
import RoutesBusiness from '~/modules/business/routes';
import RoutesCustomer from '~/modules/customers/routes';
import RoutesCommand from '~/modules/commands/routes';

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
