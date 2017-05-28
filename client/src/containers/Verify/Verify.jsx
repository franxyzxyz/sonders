import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import styles from './Verify.css';
import { sendVerification } from '../../actions';
import { SEND_VERIFICATION } from '../../actions/constants';

class Verify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      isFetching: false,
    };
    this.login = () => this.props.history.push('/login');
    this.verify = () => {
      this.props.dispatch(sendVerification());
    };
  }

  render() {
    const { isFetching, result } = this.state;
    const { request, error, verified } = this.props;
    if (request) {
      return (
        <div className={styles.loginStatus}>Verifying...</div>
      );
    }

    const verificationResult = verifiedEmail => ({
      message: verifiedEmail ? <div>Account Successfully Verified<p>{verifiedEmail}</p><div>Welcome to Sonders!</div></div> :
      <div>Failed to verify</div>,
      action: verifiedEmail ? this.login : this.verify,
      actionMsg: verifiedEmail ? 'Log In' : 'Resend Verification Email',
    });
    return (
      <div className={styles.title}>
        <div className={styles.loginBox}>
          <div className={styles.loginStatus}>
            {verificationResult(verified).message}
          </div>
          <div className={styles.loginAction}>
            <button onClick={verificationResult(verified).action}>
              {verificationResult(verified).actionMsg}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Verify.propTypes = {
  request: PropTypes.bool,
  dispatch: PropTypes.func,
  verified: PropTypes.bool,
};

const mapStateToProps = state => ({
  request: state.currentRequest[SEND_VERIFICATION],
  error: state.requestError[SEND_VERIFICATION],
  verified: state.verified,
});

module.exports = connect(
  mapStateToProps,
)(Verify);
