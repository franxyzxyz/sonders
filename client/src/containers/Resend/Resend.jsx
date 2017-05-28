import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import axios from 'axios';
import styles from './Resend.css';
import Loading from '../../components/Loading/Loading';
import config from '../../../config';

class Verify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      error: null,
      result: null,
      email: null,
    };
    this.resend = this.resend.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isVerified()) {
      browserHistory.push('/login')
    }
  }

  reset() {
    this.setState({
      isFetching: false,
      error: null,
      result: null,
      email: null,
    });
  }

  resend() {
    this.setState({
      isFetching: true,
    });

    axios.post(`${config.apiPath}/verify/send`, {
      email: this.email.value,
    })
    .then((result) => {
      this.setState({
        isFetching: false,
        email: this.email.value,
        result: result.data.message,
      });
    })
    .catch((error) => {
      if (error.response) {
        this.setState({
          error: error.response.data.message,
          isFetching: false,
        });
      }
    });
  }

  render() {
    const withResult = (
      <div className={styles.resent}>
        <b>Verification code Sent</b><br/>
        Please Check Your Mailbox
        <div className={styles.action}>
          If you are unable to receive the email
          <button className={styles.basicButton} onClick={this.reset}>SEND AGAIN</button>
        </div>
      </div>
    );

    return (
      <div className={styles.wrapper}>
        <div className={styles.resendBox}>
          {this.state.isFetching &&
            <Loading />
          }
          {this.state.error &&
            <div className={styles.error}>
              {this.state.error}
            </div>
          }
          {this.state.result ?
            withResult :
            <div className={styles.content}>
              <div className={styles.resendTitle}>
                Resend Verification
              </div>
              <input
                type="email"
                className={styles.basicInput}
                placeholder="Your email address"
                ref={(c) => { this.email = c; }}
              />
              <button className={styles.basicButton} onClick={this.resend}>Resend</button>
            </div>
          }
        </div>
      </div>
    );
  }
}

Verify.propTypes = {
  auth: PropTypes.shape({}),
  login: PropTypes.func,
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
