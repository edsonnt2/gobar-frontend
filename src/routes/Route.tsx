import React from 'react';
import { Route as ReactDOMRoute, RouteProps, Redirect } from 'react-router-dom';
import { useAuth } from '../hooks/Auth';

interface ReactDOMRouteProps extends RouteProps {
  isPrimave?: boolean;
  isReleased?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<ReactDOMRouteProps> = ({
  isPrimave = false,
  isReleased = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        return isPrimave === !!user || isReleased ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrimave ? '/' : '/dashboard',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default Route;
