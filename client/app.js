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
    const ReduxProvider = React.createFactory(Provider);
    const { configureStore } = require('./src/reducers');
    const serverConfig = require('./src/routes/server');
    const { generalState } = require('./src/reducers/initState');

    const context = {};
    const store = configureStore(generalState);

    if (context.url) {
      return res.redirect(302, context.url);
    } else {
      const renderHTML = ReactDOMServer.renderToString(
        ReduxProvider(
          { store },
          serverConfig(req, context, store.getState())
        )
      );
      return res.send(`<!DOCTYPE html>${renderHTML}`);
    }
  });
}

app.listen(app.get('port'), () => {
  console.log(`listening to port ${app.get('port')}`);
});
