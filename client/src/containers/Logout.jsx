import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { postLogout } from '../actions';

import { LinkButton } from '../utils/styles/global';

class Logout extends React.Component {
  constructor(props) {
    super(props);
    this.logout = () => {
      this.props.dispatch(postLogout());
    };
  }
  render() {
    const { loggedIn, verified } = this.props;
    if (loggedIn) {
      return (
        <LinkButton onClick={this.logout}>Logout</LinkButton>
      )
    }
    return null;
  }
}

Logout.propTypes = {
  loggedIn: PropTypes.bool,
  dispatch: PropTypes.func,
};

const mapStateToProps = state => ({
  loggedIn: state.loggedIn,
  verified: state.verified,
});

module.exports = connect(
  mapStateToProps,
)(Logout);
