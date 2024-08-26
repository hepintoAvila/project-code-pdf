import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const { error, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      console.error('Auth0 Error:', error);
    }

    if (isAuthenticated) {
      navigate('/', { replace: true }); // Redirige al home o a otra ruta después de la autenticación
    }
  }, [error, isAuthenticated, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {error ? <div>Error: {error.message}</div> : <div>Authenticating...</div>}
    </div>
  );
};

export default Callback;
