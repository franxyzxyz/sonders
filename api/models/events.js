import _ from 'lodash';
import uuid from 'uuid';

import { getSession, Events } from '../utils/neo4j';
import { newError, dbError } from '../utils/errorHandler';
import { imageUpload, deleteImage } from '../utils/imageUpload';
import { Event } from './neo4j/event';

const isDateValid = (start, end) => (start < end);

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
    .catch(err => (
      next(dbError(err))
    ));
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
    .catch(err => (
      next(dbError(err))
    ));
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

  const { startDate, endDate } = req.body;
  if (!isDateValid(startDate, endDate)) {
    next(newError(403, 'startDate cannot be later than endDate'));
  }

  imageUpload(imageParams)
    .then((imageResult) => {
      const { fullId } = imageResult;
      const newEventParam = _.chain(req.body).omit('imageData').extend(fullId ? { image: fullId } : {}).value();
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
    .catch(err => (
      next(dbError(err))
    ));
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
    .catch(err => (
      next(dbError(err))
    ));
};

const update = (req, res, next) => {
  if (_.isEmpty(req.body)) {
    throw newError(404, 'request body must at least contain one prop');
  }
  const { startDate, endDate } = req.body;
  if (!(startDate && endDate)) {
    next(newError(403, 'must provide startDate and endDate'));
    if (!isDateValid(startDate, endDate)) {
      next(newError(403, 'startDate cannot be later than endDate'));
    }
  }

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
    .catch(err => (
      next(dbError(err))
    ));
};

const updateImage = (req, res, next) => {
  const session = getSession(req);
  const eventParams = { id: 'event_id' };
  const userParams = { id: 'user_id' };
  const params = {
    event_id: req.params.event_id,
    user_id: req.user.id,
    image: '',
  };
  const newParams = { image: '' };
  const names = {
    event: 'event',
    user: 'user',
    rel: 'r',
  };
  const imageParams = {
    imageData: req.body.imageData,
    userId: req.user.id,
    mediaSrc: 'event',
  };
  imageUpload(imageParams)
    .then((imageResult) => {
      if (!_.isEmpty(imageResult)) {
        const { fullId } = imageResult;
        params.image = fullId;
        newParams.image = fullId;
      }

      session.run(Events.updateReturnOrg(eventParams, userParams, names, newParams), params)
      .then((updated) => {
        if (_.isEmpty(updated.records)) {
          throw newError(404, 'Unauthorized action');
        }
        const updatedEvent = updated.records[0].get(names.event);
        const imageToBeDeleted = updated.records[0].get('orgImage');
        deleteImage(imageToBeDeleted)
        .then((result) => {
          if (result.delete && updatedEvent) {
            res.status(200).json({
              message: 'successfully updated with image updated',
              event: new Event(updatedEvent),
            });
          } else {
            res.status(200).json({
              message: 'successfully updated with no image removed',
              event: new Event(updatedEvent),
            });
          }
        })
        .catch(() => {
          throw newError(403, 'Successfully updated but unable to delete image resource');
        });
      })
      .catch(err => (
        next(dbError(err))
      ));
    });
};

const linkEvent = (req, res, next) => {
  //  body => { end: end-event-id}
  const session = getSession(req);
  const params = {
    start_id: req.params.event_id,
    end_id: req.body.end,
    user_id: req.user.id,
  };
  const names = {
    start: 'startEvt',
    user: 'user',
    end: 'endEvt',
    rel: 'r',
  };
  const startParams = { id: 'start_id' };
  const endNode = { name: names.end, label: 'Event' };
  const endParams = { id: 'end_id' };
  const userParams = { id: 'user_id' };
  return session.run(Events.linkEvent(startParams, endNode, endParams, userParams, names), params)
    .then((results) => {
      if (_.isEmpty(results.records)) {
        throw newError(404, 'No events found');
      }
      res.status(200).json({
        message: 'Events linked',
        rel: results.records[0].get(names.rel),
      });
    })
    .catch(err => (
      next(dbError(err))
    ));
};

const detachCause = (req, res, next) => {
  //  body => { end: end-event-id}
  const session = getSession(req);
  const params = {
    start_id: req.params.event_id,
    end_id: req.body.end,
    user_id: req.user.id,
  };
  const names = {
    start: 'startEvt',
    user: 'user',
    end: 'endEvt',
    rel: 'r',
  };
  const startParams = { id: 'start_id' };
  const endNode = { name: names.end, label: 'Event' };
  const endParams = { id: 'end_id' };
  const userParams = { id: 'user_id' };
  return session.run(Events.detachEvent(startParams, endNode, endParams, userParams, names), params)
  .then((results) => {
    if (_.isEmpty(results.records)) {
      throw newError(404, 'No available relationship found');
    }
    res.status(200).json({
      message: 'Event detached from the event',
      deletedRel: results.records[0].get(names.rel),
    });
  })
  .catch(err => (
    next(dbError(err))
  ));
};

module.exports = {
  readAll,
  read,
  add,
  deleteEvent,
  update,
  updateImage,
  linkEvent,
  detachCause,
};
