import React from 'react';
import { Route as ReactDOMRoute, RouteProps, Redirect } from 'react-router-dom';
import { useAuth } from '../hooks/Auth';

interface ReactDOMRouteProps extends RouteProps {
  isPrivate?: boolean;
  isReleased?: boolean;
  isBusiness?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<ReactDOMRouteProps> = ({
  isPrivate = false,
  isReleased = false,
  isBusiness = false,
  component: Component,
  ...rest
}) => {
  const { user, business } = useAuth();

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        if (isPrivate === !!user || isReleased) {
          return isBusiness === !!business ? (
            <Component />
          ) : (
            <Redirect
              to={{
                pathname: isBusiness ? '/dashboard' : '/business',
                state: { from: location },
              }}
            />
          );
        }
        return (
          <Redirect
            to={{
              pathname: isPrivate ? '/' : '/dashboard',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default Route;
