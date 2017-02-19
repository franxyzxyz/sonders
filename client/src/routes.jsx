import { Route, IndexRoute, Redirect } from 'react-router';

import React from 'react';
import Home from './components/Home/Home';
import Login from './containers/Login/Login';
import Register from './containers/Register/Register';
import Verify from './containers/Verify/Verify';
import Resend from './containers/Resend/Resend';
import Index from './containers/Index/Index';
import Profile from './containers/Profile/Profile';
import Auth from './utils/auth';

const auth = new Auth();
const ifLogged = (nextState, replace) => {
  if (!auth.isLoggedIn()) {
    replace('/login');
  }
};

const ifVerified = (nextState, replace) => {
  if (auth.isVerified()) {
    replace('/profile/123');
  }
};

const routes = (
  <Route path="/" component={Index} auth={auth}>
    <IndexRoute component={Home} />
    <Route path="login" component={Login} />
    <Route path="join" component={Register} />
    <Route path="verify" component={Verify} onEnter={ifVerified}>
      <Route path="resend" component={Resend} />
    </Route>
    <Route path="profile/:profileId" component={Profile} onEnter={ifLogged} />
    <Redirect from="*" to="/" />
  </Route>
);


module.exports = routes;
