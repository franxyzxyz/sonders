/* eslint-disable no-undef, class-methods-use-this */
import _ from 'lodash';
import jwtDecode from 'jwt-decode';
import moment from 'moment';

export default class Auth {
  isLoggedIn() {
    if (_.isEmpty(this.getToken())) {
      return false;
    }

    const jwt = jwtDecode(this.getToken());
    if (jwt.exp && !moment(jwt.exp * 1000).isAfter()) {
      return false;
    }

    return true;
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
    localStorage.removeItem('acc_token');
  }

}
