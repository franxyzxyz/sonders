import { fork } from 'redux-saga/effects';
import { getEventsFlow } from './events';
import {
  loginFlow,
  logoutFlow,
  verifyFlow,
} from './users';

function* root() {
  yield fork(loginFlow);
  yield fork(logoutFlow);
  yield fork(verifyFlow);

  yield fork(getEventsFlow);
}

module.exports = root;
