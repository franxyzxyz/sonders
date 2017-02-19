/* eslint-disable no-undef, no-underscore-dangle */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import store from './reducers';
import routes from './routes';

const initialState = window.__INITIAL_STATE__;
const initStore = store.configureStore(initialState);

ReactDOM.render(
  <Provider store={initStore}>
    <Router history={browserHistory} routes={routes} />
  </Provider>,
  process.env.NODE_ENV !== 'production' ? document.getElementById('app') : document,
);
