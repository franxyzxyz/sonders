import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { browserHistory } from 'react-router';
// import cx from 'classnames';
import _ from 'lodash';
// import axios from 'axios';
import styles from './Register.css';
// import Loading from '../../components/Loading/Loading';
import config from '../../../config';
import { schemaValidator } from '../../utils/validation';
import Input from '../../components/Input/Input';

const REGISTER_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
      minLength: config.name.minLength,
      maxLength: config.name.maxLength,
    },
    username: {
      type: 'string',
      uniqueItems: true,
      maxLength: config.username.maxLength,
    },
    password: {
      type: 'string',
      minLength: config.password.minLength,
      maxLength: config.password.maxLength,
    },
    email: {
      type: 'string',
      format: 'email',
      maxLength: config.email.maxLength,
    },
    confirmPassword: {
      type: 'string',
      minLength: config.password.minLength,
      maxLength: config.password.maxLength,
    },
    // location: {
    //   type: 'string',
    //   enum: Object.keys(location),
    // },
    // industry: {
    //   type: 'string',
    //   enum: industry,
    // },
    role: {
      type: 'array',
      items: {
        type: 'string',
        maxLength: config.default.title.maxLength,
      },
    },
  },
  required: ['name', 'username', 'password', 'email', 'confirmPassword'],
};

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      fields: {
        name: '',
        username: '',
        password: '',
        email: '',
        confirmPassword: '',
      },
      fieldError: {},
    };
    this.register = this.register.bind(this);
    this.fieldChange = (fieldName, value) => {
      this.setState(prevState => ({
        fields: _.assign({}, prevState.fields, {
          [fieldName]: value,
        }),
      }));
    };
  }

  register() {
    if (_.some(_.values(this.state.fields), value => !value)) {
      _.each(this.state.fields, (field, key) => {
        if (!field) {
          this.setState((prevState, props) => {
            return { fieldError: _.assign({}, prevState.fieldError, {
              [key]: 'cannot be empty'
            })};
          });
        } else {
          this.setState((prevState, props) => {
            return { fieldError: _.assign({}, prevState.fieldError, {
              [key]: null
            })};
          });
        }
      })
    }
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
    const { fieldError, fields } = this.state;
    return (
      <div className={styles.wrapper}>
        <div className={styles.registerBox}>
          <div className={styles.registerTitle}>
            Register
          </div>
          <div className={styles.registerContent}>
            <Input
              type="text"
              placeholder="Username"
              onChange={this.fieldChange}
              name="username"
              value={fields.username}
              error={fieldError.username}
            />
            <div className={styles.link}>
              <div />
            </div>
            <Input
              type="email"
              placeholder="Email"
              onChange={this.fieldChange}
              name="email"
              error={fieldError.email}
            />
            <div className={styles.link}>
              <div />
            </div>
            <Input
              type="text"
              placeholder="Display Name"
              onChange={this.fieldChange}
              name="name"
              error={fieldError.name}
            />
            <div className={styles.link}>
              <div />
            </div>
            <Input
              type="password"
              placeholder="Password (minimum 8 characters)"
              onChange={this.fieldChange}
              name="password"
              error={fieldError.password}
            />
            <div className={styles.link}>
              <div />
            </div>
            <Input
              type="password"
              placeholder="Confirm Password"
              onChange={this.fieldChange}
              name="confirmPassword"
              error={fieldError.confirmPassword}
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
)(Register);
