import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import axios from 'axios';
import styles from './Verify.css';
import config from '../../../config';

class Verify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      isFetching: false,
    };
    this.verify = this.verify.bind(this);
    this.login = () => browserHistory.push('/login');
  }

  componentDidMount() {
    this.verify();
  }

  resend() {
    // [WIP] Resend verification token
  }

  verify() {
    const { query } = this.props.location;
    if (this.props.auth.isLoggedIn()) {
      // this.props.auth.logout();
      browserHistory.push('/')
      return;
    }
    this.setState({
      isFetching: true,
    });
    if (query.click) {
      axios.get(`${config.apiPath}/verify?click=${query.click}`)
        .then((result) => {
          if (result.data.user) {
            this.setState({
              result: result.data.user.email,
              isFetching: false,
            });
          }
        })
        .catch((err) => {
          this.setState({
            isFetching: false,
          })
        })
    } else {
      this.setState({
        isFetching: false,
      });
      browserHistory.push('login')
    }
  }

  render() {
    const { isFetching, result } = this.state;
    if (isFetching) {
      return (
        <div className={styles.loginStatus}>Verifying...</div>
      );
    }

    const verificationResult = verifiedEmail => ({
      message: verifiedEmail ? <div>Account Successfully Verified<p>{verifiedEmail}</p><div>Welcome to Sonders!</div></div> :
      <div>Failed to verify</div>,
      action: verifiedEmail ? this.login : this.resend,
      actionMsg: verifiedEmail ? 'Log In' : 'Resend Verification Email',
    });
    return (
      <div className={styles.title}>
        <div className={styles.loginBox}>
          <div className={styles.loginStatus}>
            {verificationResult(result).message}
          </div>
          <div className={styles.loginAction}>
            <button onClick={verificationResult(result).action}>
              {verificationResult(result).actionMsg}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Verify.propTypes = {
  // count: React.PropTypes.number,
  auth: React.PropTypes.shape({}),
  login: React.PropTypes.func,
};
//
// const mapDispatchToProps = dispatch => ({
//   login: () => {
//     console.log(this.username)
//     console.log(this.password)
//     // fetch('localhost:3000/login', {
//     //   method: 'POST',
//     //   body: JSON.stringify()
//     // })
//     // .then(function(res){ return res.json(); })
//
//   }
// })

module.exports = connect(
  // null,
  // mapStateToProps,
  // mapDispatchToProps,
)(Verify);
