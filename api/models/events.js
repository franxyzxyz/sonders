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

const deleteEvent = (req, res, next) => {
  const session = getSession(req);
  const params = {
    event_id: req.params.event_id,
    user_id: req.user.id,
  };
  const names = {
    event: 'event',
    user: 'user',
    rel: 'r',
  };
  const eventParams = '{ id: {event_id} }';
  const userParams = '{ id: {user_id} }';

  return session.run(Events.delete(eventParams, userParams, names), params)
    .then((results) => {
      if (_.isEmpty(results.records)) {
        throw newError(404, 'Unauthorized action');
      }
      const deletedEvent = results.records[0].get('event_id');
      if (deletedEvent) {
        res.status(200).json({
          message: 'event successfully deleted',
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
  deleteEvent,
};
