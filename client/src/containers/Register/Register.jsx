import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import { browserHistory } from 'react-router';
// import cx from 'classnames';
import _ from 'lodash';
// import axios from 'axios';
import styles from './Register.css';
import { postRegister } from '../../actions';
import { POST_REGISTER } from '../../actions/constants';
// import Loading from '../../components/Loading/Loading';
import config from '../../../config';
import { schemaValidator } from '../../utils/validation';
import Input from '../../components/Input/Input';
import StyledButton from '../../styles/Button';
import StyledDisabledButton from '../../styles/DisabledButton';

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


// const Button = styled.button`
//   outline: none;
//   cursor: pointer;
//   flex: 1;
//   border: 0;
//   border-radius: 20px;
//   font-size: 1em;
//   color: #fff;
//   font-family: Karla, sans-serif;
//   padding: 5px 15px;
//   background: #ffbf00;
//   transition: 0.1s ease-out;
//   &:hover {
//     color: #444;
//   }
// `;

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      fields: {
        displayName: '',
        password: '',
        email: '',
      },
      fieldError: {
        password: true,
      },
    };
    this.register = this.register.bind(this);
    this.fieldChange = (fieldName, value, error) => {
      this.setState(prevState => ({
        fields: _.assign({}, prevState.fields, {
          [fieldName]: value,
        }),
        fieldError: _.assign({}, prevState.fieldError, {
          [fieldName]: error,
        }),
      }));
    };
  }

  register() {
    const { displayName, email, password } = this.state.fields;
    this.props.dispatch(postRegister({ displayName, email, password }));
  }

  render() {
    const { fieldError, fields } = this.state;
    const okToSubmit = !_.some(_.values(fields), value => !value) && _.every(_.values(fieldError), value => !value);
    const { request } = this.props;

    if (request) {
      console.log(request.result)
    }
    if (request) {
      return(
        <div>Loading...</div>
      )
    }
    return (
      <div className={styles.wrapper}>
        <div className={styles.registerBox}>
          <div className={styles.registerTitle}>
            Register
          </div>
          <div className={styles.registerContent}>
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
              name="displayName"
              error={fieldError.displayName}
            />
            <div className={styles.link}>
              <div />
            </div>
            <Input
              type="password"
              placeholder="Password (minimum 8 characters)"
              validatePlaceHolder="Confirm Password"
              onChange={this.fieldChange}
              name="password"
              validate="same"
              minLength={8}
              error={fieldError.password}
            />
            <div className={styles.link}>
              <div />
            </div>
            <div className={styles.registerAction}>
              {!okToSubmit ?
                <StyledDisabledButton type="submit">Join Sonders</StyledDisabledButton>
                :
                <StyledButton type="submit" onClick={this.register}>Join Sonders</StyledButton>
              }
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
const mapStateToProps = state => ({
  request: state.currentRequest[POST_REGISTER]
});

module.exports = connect(
  // null,
  mapStateToProps,
  // mapDispatchToProps,
)(Register);
