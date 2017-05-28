import { combineReducers, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import _ from 'lodash';

import { generalState } from './initState';

import {
  SET_EVENT_SELF,
  REQUEST_ERROR,
  SENDING_REQUEST,
  SET_USER,
} from '../actions/constants';

const sagaMiddleware = createSagaMiddleware();

const rootReducer = (state = generalState, action) => {
  switch (action.type) {
    case SET_EVENT_SELF:
      return _.assign({}, state, {
        entities: _.assign({}, state.entities, {
          events: action.events,
        }),
      });
    case REQUEST_ERROR:
      return _.assign({}, state, {
        error: action.error,
        requestError: _.assign({}, state.requestError, {
          [action.actionType]: action.error,
        }),
      });
    case SENDING_REQUEST:
      return _.assign({}, state, {
        currentRequest: _.assign({}, state.currentRequest, {
          [action.current.action]: action.current.state,
        }),
      });
    case SET_USER:
      return _.assign({}, state, {
        loggedIn: action.state,
        verified: action.verified,
      });
    default:
      return state;
  }
};

module.exports = {
  rootReducer,
  configureStore: () =>
   createStore(rootReducer, generalState, applyMiddleware(
     sagaMiddleware,
  )),
};
