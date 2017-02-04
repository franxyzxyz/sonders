import { Router } from 'express';
import Users from '../models/users';
import Events from '../models/events';
import nconf from '../config';
import { schemaValidator } from '../utils/validation';
import { location, industry } from '../utils/users';

const router = Router();
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
      enum: Object.keys(location),
    },
    industry: {
      type: 'string',
      enum: industry,
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

const UPLOAD_IMAGE = {
  type: 'object',
  additionalProperties: false,
  properties: {
    imageData: {
      type: 'string',
      maxLength: nconf.get('media').image.maxLength,
    },
    mediaSource: {
      type: 'string',
      enum: ['event', 'user', 'story'],
    },
  },
  required: ['imageData', 'mediaSource'],
};
router.route('/login')
  .post(schemaValidator(LOGIN_SCHEMA), Users.login);

router.route('/register')
  .post(schemaValidator(REGISTER_SCHEMA), Users.register);

router.route('/user')
  .patch(schemaValidator(UPDATE_SCHEMA), Users.update);

// router.route('/user/search')
//   .get(Users.searchUsers);

router.route('/user/:user_id')
  .get(Users.read);

router.route('/user/:user_id/events')
  .get(Events.readAll);

module.exports = router;
