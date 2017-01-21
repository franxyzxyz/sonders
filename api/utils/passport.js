import { Strategy as LocalStrategy } from 'passport-local';
import uuid from 'uuid';
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

    // User.where({username: username}, function(err, user){
    //   if (err) return callback(err);
    //
    //   if (user.length !== 0){
    //     return callback(null, false, {message: 'Oops! username has been taken'})
    //   }else{
    //     var newUser = req.body;
    //     Q.nfcall(validation.fields, req.body, UserSchema, null)
    //      .then(function(){
    //        newUser.password = encrypt(newUser.password);
    //        User.save(newUser, function(err, user){
    //          if (err) return callback(null, false, {message: err.code});
    //          return callback(null, newUser, {message: 'successfully signed up'})
    //        })
    //      })
    //      .catch(function(error){
    //       callback(null, false, {message: error})
    //      })
    //   }
    // })
  }));

  // passport.use('local-login', new LocalStrategy({
  //   usernameField: 'username',
  //   passwordField: 'password',
  //   passReqToCallback : true
  // },function(req, username, password, callback){
  //   var loginParams = req.body
  //   Q.nfcall(validation.fields, loginParams, {username:null, password: null}, null)
  //    .then(function(){
  //     User.where({username: username}, function(err, user){
  //       if (err) return callback(err);
  //       if (user.length == 0) return callback(null, false, {message: 'cannot find user'});
  //
  //       if (!validPassword(password, user[0].password)) return callback(null, false, {message: 'password does not match'});
  //
  //       return callback(null, user, {message: 'successfully logged in'});
  //     })
  //    })
  //    .catch(function(error){
  //      res.status(401).json({success: false, message: error});
  //    })
  // }))
};
