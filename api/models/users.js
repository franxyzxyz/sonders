import _ from 'lodash';
import passport from 'passport';

import dbUtils from '../utils/neo4j';
import { newError } from '../utils/errorHandler';
import User from './neo4j/user';

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
  const { username, password } = req.body;
  const session = dbUtils.getSession(req);
  if (!username) {
    throw newError(400, 'username is required');
  }
  if (!password) {
    throw newError(400, 'password is required');
  }

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

module.exports = {
  register,
};
