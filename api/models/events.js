import _ from 'lodash';

import { getSession, Events } from '../utils/neo4j';
import { newError } from '../utils/errorHandler';
import { Event } from './neo4j/event';

const add = (req, res, next) => {
  const session = getSession(req);
  const params = _.extend(req.body, { id: req.user.id });
  return session.run(Events.save(req.body, req.user), params)
    .then((results) => {
      const returnUser = results.records[0].get('event');
      if (returnUser) {
        res.status(200).json({
          message: 'event successfully added',
          event: new Event(returnUser),
        });
      } else {
        res.status(200).json({
          message: 'Error with DB connection',
        });
        throw newError(400, 'Error with DB connection');
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  add,
};
