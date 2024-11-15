import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, ...rest }) => {
    const token = localStorage.getItem('access_token');
    
    return token ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
