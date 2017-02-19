/* eslint-disable no-console */
import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import passport from 'passport';
import bodyParser from 'body-parser';
import expressjwt from 'express-jwt';
import logger from 'morgan';
import nconf from './config';
import { users, events, medias, stories } from './routes';

require('./utils/passport')(passport);

const app = express();
const api = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', nconf.get('client_url'));
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(logger('dev'));

const options = {
  swaggerDefinition: {
    info: {
      title: 'Sonders API',
      version: '1.0.0',
    },
    host: 'localhost:3000',
    basePath: '/',
  },
  apis: ['./models/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);

app.use(nconf.get('api_path'), api);
app.set('port', nconf.get('PORT'));

app.use(passport.initialize());
app.use(passport.session());

// API Routes
api.use(expressjwt({ secret: nconf.get('jwt_secret') }).unless({
  path: [/login/i, /register/i],
}), users);
api.use(expressjwt({ secret: nconf.get('jwt_secret') }), events);
api.use(expressjwt({ secret: nconf.get('jwt_secret') }), medias);
api.use(expressjwt({ secret: nconf.get('jwt_secret') }), stories);

api.get('/health', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'OK',
  });
});

api.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use((err, req, res, next) => {
  if (err) {
    try {
      if (err.name === 'UnauthorizedError') {
        return res.status(err.status).json({
          message: err.message,
        });
      }
      const json = JSON.parse(err.message);
      const { description, status } = json;
      res.status(status).json({
        message: description,
      });
    } catch (e) {
      res.status(503).json({
        message: 'error',
      });
    }
  }
  return next();
});

// Error handling
app.listen(app.get('port'), () => {
  console.log(`app listening to port ${app.get('port')}`);
});
