/* eslint-disable no-console */
import express from 'express';
import nconf from './config';

const app = express();
const api = express();

app.use(nconf.get('api_path'), api);
app.set('port', nconf.get('PORT'));

api.get('/health', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'OK',
  });
});

app.listen(app.get('port'), () => {
  console.log(`app listening to port ${app.get('port')}`);
});
