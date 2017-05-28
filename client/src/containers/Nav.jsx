import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import NavComponent from '../components/NavComponent';

const NavWrapper = styled.div`
  min-width: 100px;
`;

const display = true;

class Nav extends React.Component {
  render() {
    const { loggedIn, verified } = this.props;
    return (
      <NavWrapper>
        <NavComponent to="/top" label="Home" display={display} />
        <NavComponent to="/about" label="About" display={display} />
        <NavComponent to="/home/abc" label="Profile" display={loggedIn} />
        <NavComponent to="/login" label="Login" display={!loggedIn} />
        <NavComponent to="/verify" label="Verify" display={loggedIn && !verified} />
        <NavComponent to="/register" label="Register" display={!loggedIn} />
      </NavWrapper>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.loggedIn,
  verified: state.verified,
});

Nav.propTypes = {
  loggedIn: PropTypes.bool,
  verified: PropTypes.bool,
};

module.exports = connect(
  mapStateToProps,
)(Nav);
