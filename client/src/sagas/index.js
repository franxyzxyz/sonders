import { fork } from 'redux-saga/effects';
import { getEventsFlow } from './events';
import {
  loginFlow,
  logoutFlow,
  verifyFlow,
  registerFlow,
} from './users';

function* root() {
  yield fork(loginFlow);
  yield fork(logoutFlow);
  yield fork(verifyFlow);
  yield fork(registerFlow);

  yield fork(getEventsFlow);
}

module.exports = root;
