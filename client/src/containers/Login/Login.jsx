import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './Login.css';
import Loading from '../../components/Loading/Loading';
import { postLogin, postLogout } from '../../actions';
import { POST_LOGIN } from '../../actions/constants';

class Login extends React.Component {
  constructor(props) {
    super(props);
    const { dispatch } = this.props;
    this.login = () => {
      dispatch(postLogin(this.username.value, this.password.value));
    };
    this.logout = () => {
      dispatch(postLogout());
    };
  }

  render() {
    const { request, loggedIn, error } = this.props;
    if (loggedIn) {
      return (
        <div className={styles.title}>
          <div className={styles.loginBox}>
            <div className={styles.loginStatus}>You have Logged In</div>
            <div className={styles.loginAction}>
              <button onClick={this.logout}>Log Out?</button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={styles.title}>
        <div className={styles.loginBox}>
          {request ?
            <Loading /> :
            <div className={styles.loginContent}>
              {error &&
                <div className={styles.hint}>{error} Please try again</div>
              }
              <input type="text" placeholder="username" ref={(c) => { this.username = c; }} />
              <div className={styles.link}>
                <div />
              </div>
              <input type="password" placeholder="password" ref={(c) => { this.password = c; }} />
              <div className={styles.link}>
                <div />
              </div>
              <div className={styles.loginAction}>
                <button onClick={this.login}>Log In</button>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func,
  request: PropTypes.bool,
  loggedIn: PropTypes.bool,
  error: PropTypes.string,
};

const mapStateToProps = state => ({
  error: state.requestError[POST_LOGIN],
  request: state.currentRequest[POST_LOGIN],
  loggedIn: state.loggedIn,
});

module.exports = connect(
  mapStateToProps,
)(Login);
