import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const AdminRoute = ({ component: Component, ...rest }) => {
  const { user, isAuthenticated } = useAuth0();

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated && user['https://your-app.com/roles'].includes('admin') ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

export default AdminRoute;
