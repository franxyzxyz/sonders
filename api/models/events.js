import _ from 'lodash';
import uuid from 'uuid';

import { getSession, Events } from '../utils/neo4j';
import { newError } from '../utils/errorHandler';
import { imageUpload, deleteImage } from '../utils/imageUpload';
import { Event } from './neo4j/event';

const readAll = (req, res, next) => {
  const session = getSession(req);
  const userId = req.params.user_id ? req.params.user_id : req.user.id;
  const userParams = { id: 'user_id' };
  return session.run(Events.readAll(userParams), { user_id: userId })
    .then((results) => {
      if (_.isEmpty(results.records)) {
        throw newError(404, 'No events found');
      }
      const events = _.map(results.records, record => new Event(record.get('event')));
      res.status(200).json({
        message: 'events found',
        events,
      });
    })
    .catch(() => {
      next(newError(400, 'Error with DB connection'));
    });
};

const read = (req, res, next) => {
  const session = getSession(req);
  const params = { id: req.params.event_id };
  return session.run(Events.read(params), params)
    .then((results) => {
      if (_.isEmpty(results.records)) {
        throw newError(404, 'No events found');
      }
      const returnEvent = results.records[0].get('event');
      res.status(200).json({
        message: 'event found',
        event: new Event(returnEvent),
      });
    })
    .catch(() => {
      next(newError(400, 'Error with DB connection'));
    });
};

const add = (req, res, next) => {
  const session = getSession(req);
  const eventId = uuid.v4();
  const names = {
    event: 'event',
    user: 'user',
  };
  const imageParams = {
    imageData: req.body.imageData,
    userId: req.user.id,
    mediaSrc: 'event',
  };

  imageUpload(imageParams)
    .then((imageResult) => {
      const { fullId } = imageResult;
      const newEventParam = _.chain(req.body).omit('imageData').extend({ image: fullId }).value();
      const params = _.assign({}, newEventParam, {
        user_id: req.user.id,
        event_id: eventId,
        image: fullId,
      });
      const userParams = { id: 'user_id' };
      const eventParams = { id: 'event_id' };
      return session.run(Events.save(newEventParam, userParams, names, eventParams), params)
        .then((results) => {
          const returnUser = results.records[0].get('event');
          if (returnUser) {
            res.status(200).json({
              message: 'event successfully added',
              event: new Event(returnUser),
            });
          } else {
            res.status(503).json({
              message: 'Error with DB connection',
            });
            throw newError(400, 'Error with DB connection');
          }
        })
        .catch(() => {
          // actually upload was successful, either delete the image or keep the image url;
          deleteImage(fullId)
            .then(() => {
              next(newError(400, 'Error with DB connection and deleted Image'));
            })
            .catch(() => {
              throw newError(400, 'Error with DB connection');
            });
        });
    })
    .catch(() => {
      next(newError(400, 'Error with image upload'));
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
        const deletedEventImage = results.records[0].get('image');
        deleteImage(deletedEventImage)
        .then(() => {
          res.status(200).json({
            message: 'event successfully deleted and deleted associated image',
          });
        })
        .catch(() => {
          throw newError(400, 'Error with DB connection');
        });
      } else {
        throw newError(400, 'Error with DB connection');
      }
    })
    .catch(() => {
      next(newError(400, 'Error with DB connection'));
    });
};

const update = (req, res, next) => {
  const session = getSession(req);
  const params = _.assign({}, {
    event_id: req.params.event_id,
    user_id: req.user.id,
  }, req.body);
  const names = {
    event: 'event',
    user: 'user',
    rel: 'r',
  };
  const eventParams = { id: 'event_id' };
  const userParams = { id: 'user_id' };
  session.run(Events.update(eventParams, userParams, names, req.body), params)
    .then((updated) => {
      if (_.isEmpty(updated.records)) {
        throw newError(404, 'Unauthorized action');
      }
      const updatedEvent = updated.records[0].get(names.event);
      if (updatedEvent) {
        res.status(200).json({
          message: 'successfully updated',
          event: new Event(updatedEvent),
        });
      } else {
        res.status(200).json({
          message: 'Error with DB connection',
        });
        throw newError(400, 'Error with DB connection');
      }
    })
    .catch(() => {
      next(newError(400, 'Error with DB connection'));
    });
};

module.exports = {
  readAll,
  read,
  add,
  deleteEvent,
  update,
};
