import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';

const Dashboard = ({ getCurrentProfile, auth, profile }) => {
  // We want to call getCurrentProfile as soon as it loads
  useEffect(() => {
    getCurrentProfile();
  }, []);

  return (
    <div>
      here are many variations of passages of Lorem Ipsum available, but the
      majority have suffered alteration in some form, by injected humour, or
      randomised words which don't look even slightly believable. If you are
      going to use a passage of Lorem Ipsum, you need to be sure there isn't
      anything embarrassing hidden in the middle of text. All the Lorem Ipsum
      generators on the Internet tend to repeat predefined chunks as necessary,
      making this the first true generator on the Internet. It uses a dictionary
      of over 200 Latin words, combined with a handful of model sentence
      structures, to generate Lorem Ipsum which looks reasonable. The generated
      Lorem Ipsum is therefore always free from repetition, injected humour, or
      non-characteristic words etc.
    </div>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
