/* eslint-disable no-undef, class-methods-use-this */
import _ from 'lodash';
import jwtDecode from 'jwt-decode';
import { fbauth } from '../firebase';

export default class Auth {
  isLoggedIn() {
    return !!fbauth.currentUser;
  }
  getCurrentUser() {
    return fbauth.currentUser;
  }

  isVerified() {
    if (_.isEmpty(this.getToken())) {
      return false;
    }
    const jwt = jwtDecode(this.getToken());
    return jwt.verified;
  }

  setToken(token) {
    localStorage.setItem('acc_token', token);
  }

  getToken() {
    return localStorage.getItem('acc_token');
  }

  logout() {
    return new Promise((resolve, reject) => {
      fbauth.signOut()
        .then(() => {
          resolve('logout');
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  login(email, password) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await fbauth.signInWithEmailAndPassword(email, password)
        .catch((error) => {
          throw error;
        });
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  }

  sendVerification() {
    const user = fbauth.currentUser;
    user.sendEmailVerification().then((s) => console.log(s))
  }

}
