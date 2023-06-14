import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrivateRoute = ({
  children,
  isProtectedRoute = false,
  auth: { isAuthenticated, loading },
}) => {
  return isProtectedRoute ? (
    !isAuthenticated && !loading ? (
      <Navigate to='/login' />
    ) : (
      <>{children}</>
    )
  ) : (
    <>{children}</>
  );
};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  isProtectedRoute: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
