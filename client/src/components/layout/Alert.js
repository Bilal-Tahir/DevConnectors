import React from 'react';
import PropTypes from 'prop-types';
// Any time you want to interact the component with redux like for calling an action or getting the state you want to use
import { connect } from 'react-redux';

// map through the alerts and outputs the message
const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

//Now we want to get the Alert State

// We are mapping a redux state to a prop in this component
const mapStateToProps = (state) => ({
  // States that are in root reducer.
  //So, here we want the alert state
  // Now we have props.alerts available to us
  alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);
