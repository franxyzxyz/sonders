import _ from 'lodash';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import mailgun from 'mailgun-js';
import moment from 'moment';
import jwtDecode from 'jwt-decode';
import nconf from '../config';
import { getSession, Users } from '../utils/neo4j';
import { newError, dbError } from '../utils/errorHandler';

import { PublicUser, User, SessionUser } from './neo4j/user';

/**
* @swagger
* definitions:
*   NewUser:
*     type: object
*     properties:
*       id:
*         type: string
*       username:
*         type: string
*/

const register = (req, res, next) => {
  const { username, email } = req.body;
  const session = getSession(req);
  session.run(Users.ifExists({ username }, { email }), { username, email })
  .then((results) => {
    if (!_.isEmpty(results.records)) {
      const existUsername = results.records[0].get('username');
      const existEmail = results.records[0].get('email');
      if (existUsername && existEmail) {
        throw newError(400, 'username/email already in use');
      } else if (existUsername) {
        throw newError(400, 'username already in use');
      } else if (existEmail) {
        throw newError(400, 'email already in use');
      }
      return passport.authenticate('local-signup', (err, user, status) => {
        if (err || !user) throw newError(400, status.message);
        const newUser = new User(user);
        console.log(newUser)
        const verifyToken = jwt.sign(newUser, nconf.get('verify_secret'), { expiresIn: '1d' });
        const mg = mailgun({apiKey: nconf.get('MAILGUN_API_KEY'), domain: nconf.get('MAILGUN_DOMAIN')});

        const data = {
          from: 'Sonders <account@verify.sonders.co>',
          to: newUser.email,
          subject: 'Please confirm your account',
          html: `<html><h1>SONDERS</h1><h2>Email address confirmation</h2><p>Thank you for signing up. Please verify your email address by clicking the following link:<a href="http://localhost:3000/api/v0/verify?click=${verifyToken}">CLICK HERE</a></html>`
        };

        mg.messages().send(data, function (error, body) {
          console.log(body);
        });
        return res.status(200).json({
          success: true,
          user: newUser,
          message: status.message,
        });
      })(req, res, next);
    } else {
      throw newError(400, 'DB error');
    }
  })
  .catch((err) => {
    next(dbError(err));
  })
};

const verify = (req, res, next) => {
  const session = getSession(req);
  const jwt = jwtDecode(req.query.click);
  if (jwt.exp && !moment(jwt.exp * 1000).isAfter()) {
    next(dbError(newError(403, 'Verification token has expired')));
  }
  const { id } = jwt;

  const params = _.extend({
    verified: true,
  }, { id });

  session.run(Users.update(params), params)
    .then((updated) => {
      if (!updated.records[0]) {
        throw newError(404, 'Unable to verify');
      }
      const updatedUser = updated.records[0].get('user');
      if (updatedUser) {
        res.status(200).json({
          message: 'successfully verified account',
          user: new User(updatedUser),
        });
      } else {
        throw newError(400, 'Error with DB connection');
      }
    })
    .catch(err => (
      next(dbError(err))
    ));
};

const login = (req, res, next) => {
  passport.authenticate('local-login', (err, user, status) => {
    if (err || !user) {
      return next(newError(400, err || status.message));
    }
    const newUser = new SessionUser(user);
    const token = jwt.sign(newUser, nconf.get('jwt_secret'), { expiresIn: '7d' });
    return res.status(200).json({
      success: true,
      token,
      user: newUser,
      message: status.message,
    });
  })(req, res, next);
};

const update = (req, res, next) => {
  const session = getSession(req);
  const { id } = req.user;
  const params = _.extend(req.body, { id });
  session.run(Users.update(params), params)
    .then((updated) => {
      if (!updated.records[0]) {
        throw newError(404, 'Unable to update');
      }
      const updatedUser = updated.records[0].get('user');
      if (updatedUser) {
        res.status(200).json({
          message: 'successfully updated',
          user: new User(updatedUser),
        });
      } else {
        throw newError(400, 'Error with DB connection');
      }
    })
    .catch(err => (
      next(dbError(err))
    ));
};

const read = (req, res, next) => {
  const session = getSession(req);
  const params = { id: req.params.user_id };
  return session.run(Users.read(params), params)
    .then((results) => {
      if (!results.records[0]) {
        throw newError(404, 'User not found');
      }
      const returnUser = results.records[0].get('user');
      if (returnUser) {
        res.status(200).json({
          message: 'user found',
          user: new PublicUser(returnUser),
        });
      } else {
        throw newError(400, 'Error with DB connection');
      }
    })
    .catch(err => (
      next(dbError(err))
    ));
};

module.exports = {
  read,
  register,
  login,
  update,
  verify,
};
