import _ from 'lodash';
import passport from 'passport';
import jwt from 'jsonwebtoken';

import nconf from '../config';
import { getSession, Users } from '../utils/neo4j';
import { newError } from '../utils/errorHandler';
import { User, SessionUser } from './neo4j/user';

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
  const session = getSession(req);
  session.run(Users.read({ username }), { username })
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
      return next(newError(400, err || status.message));
    }
    const newUser = new SessionUser(user);
    const token = jwt.sign(newUser, nconf.get('jwt_secret'));
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
  session.run(Users.update(id, params), params)
    .then((updated) => {
      const updatedUser = updated.records[0].get('user');
      if (updatedUser) {
        res.status(200).json({
          message: 'successfully updated',
          user: new User(updatedUser),
        });
      } else {
        res.status(200).json({
          message: 'Error with DB connection',
        });
        throw newError(400, 'Error with DB connection');
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  register,
  login,
  update,
};
