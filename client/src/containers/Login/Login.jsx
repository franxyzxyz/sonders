import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import cx from 'classnames';
import axios from 'axios';
import styles from './Login.css';
import Loading from '../../components/Loading/Loading';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      loggedIn: this.props.auth.isLoggedIn(),
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isLoggedIn()) {
      console.log('already logged in')

    }
  }

  componentDidUpdate() {
    if (this.props.auth.isLoggedIn()) {
      console.log('already logged in')
    }
  }

  login() {
    this.setState({
      isFetching: true,
    });
    axios.post('http://localhost:3000/api/v0/login', {
      username: this.username.value,
      password: this.password.value,
    })
    .then((result) => {
      this.setState({
        isFetching: false,
      });
      this.props.auth.setToken(result.data.token);
      browserHistory.push('profile/123');
    })
    // [WIP] - catch error
  }

  logout() {
    this.props.auth.logout();
    this.setState({
      loggedIn: false,
    })
  }

  render() {
    const { isFetching, loggedIn } = this.state;
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

      )
    }
    return (
      <div className={styles.title}>
        <div className={styles.loginBox}>
          {isFetching ?
            <Loading /> :
            <div className={styles.loginContent}>
              <input type="text" placeholder="username" ref={(c) => { this.username = c; }} />
              <div className={styles.link}>
                <div />
              </div>
              <input type="password" placeholder="password" ref={(c) => { this.password = c; }}/>
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
};

Login.propTypes = {
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
)(Login);
