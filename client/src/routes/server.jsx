import {
  StaticRouter,
} from 'react-router-dom';

import React from 'react';
import App from '../App';

const serverConfig = (req, context, state) => (
  <StaticRouter
    location={req.url}
    context={context}
  >
    <App initialState={state} />
  </StaticRouter>
);

module.exports = serverConfig;
