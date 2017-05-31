/* eslint-disable no-constant-condition */
import { take, call, put } from 'redux-saga/effects';
import {
  POST_LOGIN,
  REQUEST_ERROR,
  SENDING_REQUEST,
  SET_USER,
  POST_LOGOUT,
  SEND_VERIFICATION,
  POST_REGISTER,
} from '../actions/constants';
// import {
//   getEvents,
// } from '../utils/api';
import Auth from '../utils/auth';

const auth = new Auth();

function* loginFlow() {
  while (true) {
    const { email, password } = yield take(POST_LOGIN);
    yield put({ type: SENDING_REQUEST, current: { action: POST_LOGIN, state: true } });
    try {
      const user = yield call(auth.login, email, password);
      yield put({ type: SET_USER, state: true, verified: user.emailVerified });
      yield put({ type: SENDING_REQUEST, current: { action: POST_LOGIN, state: false } });
    } catch (error) {
      yield put({ type: REQUEST_ERROR, error: error.code, actionType: POST_LOGIN });
      yield put({ type: SENDING_REQUEST, current: { action: POST_LOGIN, state: false } });
    }
  }
}

function* logoutFlow() {
  while (true) {
    yield take(POST_LOGOUT);
    yield put({ type: SENDING_REQUEST, current: { action: POST_LOGOUT, state: true } });
    try {
      yield call(auth.logout);
      yield put({ type: SET_USER, state: false, verified: false });
      yield put({ type: SENDING_REQUEST, current: { action: POST_LOGOUT, state: false } });
    } catch (error) {
      yield put({ type: REQUEST_ERROR, error: error.code, actionType: POST_LOGOUT });
      yield put({ type: SENDING_REQUEST, current: { action: POST_LOGOUT, state: false } });
    }
  }
}

function* verifyFlow() {
  while (true) {
    yield take(SEND_VERIFICATION);
    yield put({ type: SENDING_REQUEST, current: { action: SEND_VERIFICATION, state: true } });
    try {
      yield call(auth.sendVerification);
      yield put({ type: SENDING_REQUEST, current: { action: SEND_VERIFICATION, state: false } });
    } catch (error) {
      yield put({ type: REQUEST_ERROR, error: error.code, actionType: SEND_VERIFICATION });
      yield put({ type: SENDING_REQUEST, current: { action: SEND_VERIFICATION, state: false } });
    }
  }
}

function* registerFlow() {
  while (true) {
    const { user } = yield take(POST_REGISTER);
    yield put({ type: SENDING_REQUEST, current: { action: POST_REGISTER, state: true } });
    try {
      const result = yield call(auth.register, user);
      yield put({ type: SENDING_REQUEST, current: { action: POST_REGISTER, state: false } });
      // [WIP] need to tell Register.jsx that its been done
    } catch (error) {
      yield put({ type: REQUEST_ERROR, error: error.code, actionType: POST_REGISTER });
      yield put({ type: SENDING_REQUEST, current: { action: POST_REGISTER, state: false } });
    }
  }
}

module.exports = {
  loginFlow,
  logoutFlow,
  verifyFlow,
  registerFlow,
};
