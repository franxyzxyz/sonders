import _ from 'lodash';
import nconf from '../../config';
import { location as locationList, industry as industryList } from '../../utils/users';

const config = nconf.get('users');

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
    location: {
      type: 'string',
      enum: Object.keys(locationList),
    },
    industry: {
      type: 'string',
      enum: industryList,
    },
    role: {
      type: 'array',
      items: {
        type: 'string',
        maxLength: config.default.title.maxLength,
      },
    },
  },
  required: ['name', 'username', 'password'],
};

const LOGIN_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    username: {
      type: 'string',
      uniqueItems: true,
      maxLength: nconf.get('users').username.maxLength,
    },
    password: {
      type: 'string',
      minLength: nconf.get('users').password.minLength,
      maxLength: nconf.get('users').password.maxLength,
    },
  },
  required: ['username', 'password'],
};

const UPDATE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: REGISTER_SCHEMA.properties,
};

const User = (_node) => {
  const field = _.chain(REGISTER_SCHEMA.properties).keys().concat('id').value();
  const user = _.chain(_node.properties)
                .pick(field)
                .omit('password')
                .value();
  return _.extend(this, user);
};

const PublicUser = (_node) => {
  const field = _.chain(REGISTER_SCHEMA.properties).keys().concat('id').value();
  const user = _.chain(_node.properties)
                .pick(field)
                .omit(['password', 'username'])
                .value();
  return _.extend(this, user);
};

const SessionUser = (_node) => {
  const { id, username } = _node.properties;
  return _.extend(this, {
    id,
    username,
  });
};

module.exports = {
  User,
  PublicUser,
  SessionUser,
  REGISTER_SCHEMA,
  LOGIN_SCHEMA,
  UPDATE_SCHEMA,
};
