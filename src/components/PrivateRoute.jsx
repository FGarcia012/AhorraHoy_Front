import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useUser } from '../contexts/userContext.js';

export const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useUser();
  return isAuthenticated ? children : <Navigate to='/auth' replace />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
