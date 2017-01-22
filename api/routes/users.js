import { Router } from 'express';
import Users from '../models/users';
import nconf from '../config';
import { schemaValidator } from '../utils/validation';

const router = Router();

const REGISTER_SCHEMA = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: nconf.get('users').name.minLength,
      maxLength: nconf.get('users').name.maxLength,
    },
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
  required: ['name', 'username', 'password'],
};

const LOGIN_SCHEMA = {
  type: 'object',
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

router.route('/login')
  .post(schemaValidator(LOGIN_SCHEMA), Users.login);

router.route('/register')
  .post(schemaValidator(REGISTER_SCHEMA), Users.register);

module.exports = router;
