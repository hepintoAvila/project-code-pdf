import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const Dashboard = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const token = await getAccessTokenSilently();
          console.log('token',token)
        const response = await axios.get('http://localhost:5000/api/permissions', {
          headers: { Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImNDanVLV2FYdTdLanNSNFhaUUJPQyJ9.eyJpc3MiOiJodHRwczovL2Rldi10d2p6dG1pcWh6eHA3cTg2LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJDaTl6U0dMTHFZUEhVeUtJOG91Ylg3a1lNdllXdEU1akBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hcGkuY2VydGlmaWNhZG9zLmNvbSIsImlhdCI6MTcyNDYxMzQ2MCwiZXhwIjoxNzI0Njk5ODYwLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMiLCJhenAiOiJDaTl6U0dMTHFZUEhVeUtJOG91Ylg3a1lNdllXdEU1aiIsInBlcm1pc3Npb25zIjpbXX0.GeCG1EF7ofMtjqSQtZcJu5_2BhQjCTzYZH_t0nFwIFCBK0v9cfCixoeIzZwvOrxP9_vdChkdKqAPsgFAcoBKMReKnd3QcyByry2FzxJq_yaFt_ZUUZSiCp7MhW8YFDWsnT18FOlKd08BVR6JdNU683lM3m-ix86x02QXpCw6Lnv-BjfqWwHsPHssrwjy8DQXkp0X46_3nMBvq3UbXF5V5s82eWvgUPcAJBfi632bBLN3F7qnOiQ8qxh-sDrdK6vQ7qgsBW76JOWlUxMWcOE34uDrX_9k02YeA7ajVxiUpBhJ5Jk4kMO_bhRKoudDficUTLZ96oQDOzm2xzriqz16TA` }
        });
        setPermissions(response.data.permissions);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };
  
    if (isAuthenticated) {
      fetchPermissions();
    }
  }, [isAuthenticated, getAccessTokenSilently]);
  
  console.log('token',user)
  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>Permissions:</h2>
        <ul>
          {permissions.map((permission, index) => (
            <li key={index}>{permission}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
