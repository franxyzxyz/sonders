/* eslint-disable no-undef, no-underscore-dangle, global-require */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware } from 'redux';
import store from './reducers';
import routes from './routes/client';
import rootSaga from './sagas';
import { fbauth } from './firebase';
import { retrieveUser } from './actions';

const sagaMiddleware = createSagaMiddleware();

const initialState = window.__INITIAL_STATE__;

const initStore = createStore(
  store.rootReducer,
  initialState,
  applyMiddleware(sagaMiddleware),
);

const sagaTask = sagaMiddleware.run(rootSaga);

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers');
    initStore.replaceReducer(nextRootReducer.rootReducer);
  });
  module.hot.accept('./sagas', () => {
    const newSage = require('./sagas');
    sagaTask.cancel();
    sagaTask.done.then(() => {
      sagaMiddleware.run(newSage);
    });
  });
}

const render = (routesConfig) => {
  ReactDOM.render(
    <Provider store={initStore}>
      {routesConfig}
    </Provider>,
    document.getElementById('app'),
  );
};


const initAuth = () => (
  new Promise((resolve, reject) => {
    const unsub = fbauth.onAuthStateChanged(
      (user) => {
        if (user) {
          console.log(user.getToken())
          initStore.dispatch(retrieveUser(true, user.emailVerified));
        }
        unsub();
        resolve();
      },
      // should dispatch error
      error => reject(error),
    );
  })
);

initAuth()
  .then(() => {
    render(routes);
  });
