import React from 'react';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import App from '../App';

const history = createBrowserHistory();
const routes = (
  <Router history={history}>
    <App />
  </Router>
);

module.exports = routes;
