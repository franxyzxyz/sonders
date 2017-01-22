import { Router } from 'express';
import Users from '../models/users';
import nconf from '../config';
import { schemaValidator } from '../utils/validation';

const router = Router();

const SIGNUP_SCHEMA = {
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

router.route('/login')
  .post(Users.login);

router.route('/register')
  .post(schemaValidator(SIGNUP_SCHEMA), Users.register);

module.exports = router;
