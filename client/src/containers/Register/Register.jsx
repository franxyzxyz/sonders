import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import cx from 'classnames';
import _ from 'lodash';
import axios from 'axios';
import styles from './Register.css';
import Loading from '../../components/Loading/Loading';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      // loggedIn: this.props.auth.isLoggedIn(),
      fieldError: {},
    };
    this.form = {};
    this.register = this.register.bind(this);
    // this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    // if (this.props.auth.isLoggedIn()) {
    //   console.log('already logged in')
    //
    // }
  }

  componentDidUpdate() {
    // if (this.props.auth.isLoggedIn()) {
    //   console.log('already logged in')
    // }
  }

  register() {
    // if ()
    const fields = _.mapValues(this.form, input => input.value);
    if (_.some(fields, value => !value)) {
      _.each(fields, (field, key) => {
        if (!field) {
          this.setState((prevState, props) => {
            return { fieldError: _.assign({}, prevState.fieldError, {
              [key]: 'cannot be empty'
            })};
          });
        }
      })
    }
    // console.log(this.username.value)
    // console.log(this.password.value)
    // console.log(this.confirmPassword.value)
    // console.log(this.name.value)
    // console.log(this.email.value)
    this.setState({
      isFetching: true,
    });
    // axios.post('http://localhost:3000/api/v0/register', {
    //   username: this.username.value,
    //   password: this.password.value,
    //
    // })
    // .then((result) => {
    //   this.setState({
    //     isFetching: false,
    //   });
    //   this.props.auth.setToken(result.data.token);
    //   browserHistory.push('profile/123');
    // })
    // [WIP] - catch error
  }

  render() {
    const { fieldError } = this.state;
    return (
      <div className={styles.wrapper}>
        <div className={styles.registerBox}>
          <div className={styles.registerTitle}>
            Register
          </div>
          <div className={styles.registerContent}>
            <input
              type="text"
              placeholder="Username"
              className={styles.basicInput}
              ref={(c) => { this.form.username = c; }}
            />
            <div className={styles.error}>{fieldError.username}</div>
            <div className={styles.link}>
              <div />
            </div>
            <input
              type="email"
              placeholder="Email"
              className={styles.basicInput}
              ref={(c) => { this.form.email = c; }}
            />
            <div className={styles.link}>
              <div />
            </div>
            <input
              type="text"
              placeholder="Display Name"
              className={styles.basicInput}
              ref={(c) => { this.form.name = c; }}
            />
            <div className={styles.link}>
              <div />
            </div>
            <input
              type="password"
              placeholder="Password (minimum 8 characters)"
              className={styles.basicInput}
              ref={(c) => { this.form.password = c; }}
            />
            <div className={styles.link}>
              <div />
            </div>
            <input
              type="password"
              placeholder="Confirm Password"
              className={styles.basicInput}
              ref={(c) => { this.form.confirmPassword = c; }}
            />
            <div className={styles.link}>
              <div />
            </div>
            <div className={styles.registerAction}>
              <button type="submit" onClick={this.register} className={styles.basicButton}>Join Sonders</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

Register.propTypes = {
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
)(Register);
