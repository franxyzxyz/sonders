import { Strategy as LocalStrategy } from 'passport-local';
import uuid from 'uuid';
import _ from 'lodash';
import bcrypt from 'bcrypt-nodejs';
import { getSession, Users } from './neo4j';
import { schemaValidatorBasic } from './validation';
import { REGISTER_SCHEMA } from '../models/neo4j/user';
// var User            = seraphModel(db, 'user');
// var UserSchema      = require('../models/User').schema;

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user[0].id);
  });

  passport.deserializeUser((id, done) => {
    console.log(id);
    done(err, { username: 'hello' });
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
    const session = getSession(req);

    const generated = {
      id: uuid.v4(),
      password: encrypted,
    };
    const params = _.chain(req.body)
                    .omit('password')
                    .extend(generated)
                    .value();
    return session.run(Users.save(params), params)
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
    const session = getSession(req);
    return session.run(Users.read({ username }), { username })
    .then((results) => {
      const returnUser = results.records[0].get('user');
      if (_.isEmpty(returnUser)) {
        return done('user not found');
      }
      // Ref: Must pass immutable obj otherwise the user object will be mutated by json validator because of (remove additional);
      if (!schemaValidatorBasic(REGISTER_SCHEMA, _.assign({}, returnUser.properties))) {
        return done('Invalid schema result');
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
    });
  }));
};
