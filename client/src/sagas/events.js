/* eslint-disable no-constant-condition */
import { take, call, put, fork, race } from 'redux-saga/effects';
import {
  GET_EVENT_SELF,
  SET_EVENT_SELF,
  REQUEST_ERROR,
  SENDING_REQUEST,
} from '../actions/constants';
import {
  getEvents,
} from '../utils/api';

function* getEventsFlow() {
  while (true) {
    yield take(GET_EVENT_SELF);
    yield put({ type: SENDING_REQUEST, current: { action: GET_EVENT_SELF, state: true } });
    try {
      const response = yield call(getEvents);
      yield put({ type: SET_EVENT_SELF, events: response.events });
      yield put({ type: SENDING_REQUEST, current: { action: GET_EVENT_SELF, state: false } });
    } catch (error) {
      yield put({ type: REQUEST_ERROR, error: error.code });
      yield put({ type: SENDING_REQUEST, current: { action: GET_EVENT_SELF, state: false } });
    }
  }
}

module.exports = {
  getEventsFlow,
};
