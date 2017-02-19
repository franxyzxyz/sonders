/* eslint-disable global-require, import/no-extraneous-dependencies, no-console*/
import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import path from 'path';
import config from './config';

const app = express();
app.set('port', config.PORT);

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('./webpack.config.js');
  const history = require('connect-history-api-fallback');

  const compiler = webpack(webpackConfig);

  app.use(history());
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
  }));
  app.use(webpackHotMiddleware(compiler));
  app.use('/', express.static(path.join(__dirname, '/dev')));
} else {
  app.use('/', express.static(path.join(__dirname, '/build')));

  app.get('*', (req, res) => {
    const ReactRouterContext = React.createFactory(RouterContext);
    const ReduxProvider = React.createFactory(Provider);
    let store = require('./src/reducers');
    const routes = require('./src/routes');

    const initialState = {
      count: 0,
    };

    store = store.configureStore(initialState);

    match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
      if (err) {
        res.status(503);
      } else if (redirectLocation) {
        return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        return res.send(`<!DOCTYPE html>${ReactDOMServer.renderToString(
          ReduxProvider({ store }, ReactRouterContext(renderProps)))}`);
      }
      return null;
    });
  });
}

app.listen(app.get('port'), () => {
  console.log(`listening to port ${app.get('port')}`);
});
