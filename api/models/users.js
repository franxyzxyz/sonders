import _ from 'lodash';
import passport from 'passport';
import jwt from 'jsonwebtoken';

import nconf from '../config';
import dbUtils from '../utils/neo4j';
import { newError } from '../utils/errorHandler';
import User from './neo4j/user';
import { fieldMatch } from '../utils/validation';

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
  const { username } = req.body;
  const session = dbUtils.getSession(req);

  session.run('MATCH (user:User {username: {username}}) RETURN user', { username })
    .then((results) => {
      if (!_.isEmpty(results.records)) {
        throw newError(400, 'username already in use');
      } else {
        return passport.authenticate('local-signup', (err, user, status) => {
          if (err || !user) throw new Error({ message: status.message, status: 400 });
          return res.status(200).json({
            success: true,
            user: new User(user),
            message: status.message,
          });
        })(req, res, next);
      }
    })
    .catch((err) => {
      next(err);
    });
};

const login = (req, res, next) => {
  passport.authenticate('local-login', (err, user, status) => {
    if (err || !user) {
      return next(newError(400, status.message));
    }
    const newUser = new User(user);
    const token = jwt.sign(newUser, nconf.get('jwt_secret'));
    return res.status(200).json({
      success: true,
      token,
      user: newUser,
      message: status.message,
    });
  })(req, res, next);
};

module.exports = {
  register,
  login,
};
