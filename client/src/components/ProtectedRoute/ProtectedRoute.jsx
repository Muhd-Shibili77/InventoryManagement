import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { refreshToken } from '../../services/AxiosInterceptor'; // Your refresh function
import {Riple} from 'react-loading-indicators'
const ProtectedRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const expiryTime = decodedToken?.exp * 1000;

        // If token expired
        if (Date.now() > expiryTime) {
          try {
            const newAccessToken = await refreshToken(); // Should return new access token
            if (newAccessToken) {
              localStorage.setItem('token', newAccessToken);
              setIsAuthenticated(true); // true
            } else {
              localStorage.removeItem('token');
              setIsAuthenticated(false);
            }
          } catch (refreshError) {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(true); // true
        }
      } catch (error) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Riple color={["#b2f5ea", "#81e6d9", "#4fd1c5", "#38b2ac"]} />
      </div>
    );
    
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return element;
};

export default ProtectedRoute;
