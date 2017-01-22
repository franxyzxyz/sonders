import { Strategy as LocalStrategy } from 'passport-local';
import uuid from 'uuid';
import _ from 'lodash';
import bcrypt from 'bcrypt-nodejs';
import dbUtils from './neo4j';
// var User            = seraphModel(db, 'user');
// var UserSchema      = require('../models/User').schema;

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user[0].id);
  });

  passport.deserializeUser((id, done) => {
    console.log(id);
    done(err, { user: 'hello' });
    // User.read(id, function(err, user) {
    //   done(err, user);
    // });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
  }, (req, username, password, done) => {
    const encrypted = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    const newUser = {
      id: uuid.v4(),
      username,
      password: encrypted,
    };
    const session = dbUtils.getSession(req);
    return session.run('CREATE (user:User {id: {id}, username: {username}, password: {password}}) RETURN user', newUser)
    .then((results) => {
      const returnUser = results.records[0].get('user');
      if (returnUser) {
        done(null, returnUser, {
          message: 'successfully signed up',
        });
      } else {
        done(null, null, {
          message: 'Error with DB connection',
        });
      }
    })
    .catch((err) => {
      done(true, null, {
        message: err,
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
  }, (req, username, password, done) => {
    const session = dbUtils.getSession(req);
    session.run('MATCH (user:User {username: {username}}) RETURN user', { username })
    .then((results) => {
      const returnUser = results.records[0].get('user');
      if (_.isEmpty(returnUser)) {
        done(true, null, {
          message: 'user not found',
        });
      }
      const { password: basePassword } = returnUser.properties;
      if (bcrypt.compareSync(password, basePassword)) {
        done(null, returnUser, {
          message: 'successfully logged in',
        });
      } else {
        done(null, null, {
          message: 'incorrect credentials',
        });
      }
    })
    .catch(err =>
      done(true, null, {
        message: err.message,
      }),
    );
  }));
};
