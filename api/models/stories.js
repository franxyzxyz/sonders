import _ from 'lodash';
import uuid from 'uuid';

import { getSession, Stories } from '../utils/neo4j';
import { newError, dbError } from '../utils/errorHandler';
import { Story } from './neo4j/story';

const add = (req, res, next) => {
  const session = getSession(req);
  const storyId = uuid.v4();
  const names = {
    story: 'story',
    user: 'user',
  };
  const params = _.assign({}, req.body, {
    user_id: req.user.id,
    story_id: storyId,
  });
  const userParams = { id: 'user_id' };
  const storyParams = { id: 'story_id' };
  return session.run(Stories.save(req.body, userParams, names, storyParams), params)
    .then((results) => {
      const returnStory = results.records[0].get('story');
      if (returnStory) {
        res.status(200).json({
          message: 'story successfully added',
          story: new Story(returnStory),
        });
      } else {
        res.status(503).json({
          message: 'Error with DB connection',
        });
        throw newError(400, 'Error with DB connection');
      }
    })
    .catch(err => (
      next(dbError(err))
    ));
};

const deleteStory = (req, res, next) => {
  const session = getSession(req);
  const params = {
    story_id: req.params.story_id,
    user_id: req.user.id,
  };
  const names = {
    story: 'story',
    user: 'user',
    rel: 'r',
  };
  const storyParams = '{ id: {story_id} }';
  const userParams = '{ id: {user_id} }';

  return session.run(Stories.delete(storyParams, userParams, names), params)
    .then((results) => {
      if (_.isEmpty(results.records)) {
        throw newError(404, 'Unauthorized action');
      }
      const deletedStory = results.records[0].get('story_id');
      if (deletedStory) {
        res.status(200).json({
          message: 'story successfully deleted',
        });
      } else {
        throw newError(400, 'Error with DB connection');
      }
    })
    .catch(err => (
      next(dbError(err))
    ));
};

const read = (req, res, next) => {
  const session = getSession(req);
  const params = { id: req.params.story_id };
  return session.run(Stories.read(params), params)
    .then((results) => {
      if (_.isEmpty(results.records)) {
        throw newError(404, 'No stories found');
      }
      const returnStory = results.records[0].get('story');
      res.status(200).json({
        message: 'story found',
        story: new Story(returnStory),
      });
    })
    .catch(err => (
      next(dbError(err))
    ));
};

const update = (req, res, next) => {
  if (_.isEmpty(req.body)) {
    throw newError(404, 'request body must at least contain one prop');
  }
  const session = getSession(req);
  const params = _.assign({}, {
    story_id: req.params.story_id,
    user_id: req.user.id,
  }, req.body);
  const names = {
    story: 'story',
    user: 'user',
    rel: 'r',
  };
  const storyParams = { id: 'story_id' };
  const userParams = { id: 'user_id' };
  return session.run(Stories.update(storyParams, userParams, names, req.body), params)
    .then((updated) => {
      if (_.isEmpty(updated.records)) {
        throw newError(404, 'Unauthorized action');
      }
      const updatedStory = updated.records[0].get(names.story);
      if (updatedStory) {
        res.status(200).json({
          message: 'successfully updated',
          story: new Story(updatedStory),
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

const readAll = (req, res, next) => {
  const session = getSession(req);
  const userId = req.params.user_id ? req.params.user_id : req.user.id;
  const userParams = { id: 'user_id' };
  return session.run(Stories.readAll(userParams), { user_id: userId })
    .then((results) => {
      if (_.isEmpty(results.records)) {
        throw newError(404, 'No events found');
      }
      const stories = _.map(results.records, record => new Story(record.get('story')));
      res.status(200).json({
        message: 'events found',
        stories,
      });
    })
    .catch(err => (
      next(dbError(err))
    ));
};

const addEventToStory = (req, res, next) => {
  const session = getSession(req);
  const params = {
    story_id: req.params.story_id,
    user_id: req.user.id,
    event_id: req.params.event_id,
  };
  const names = {
    story: 'story',
    user: 'user',
    event: 'event',
    rel: 'r',
  };
  const storyParams = { id: 'story_id' };
  const eventNode = { name: names.event, label: 'Event' };
  const eventParams = { id: 'event_id' };
  const userParams = { id: 'user_id' };
  return session.run(Stories.linkOwn(storyParams, eventNode, eventParams, userParams, names), params)
    .then((results) => {
      if (_.isEmpty(results.records)) {
        throw newError(404, 'No events/story found');
      }
      res.status(200).json({
        message: 'Story linked with the event',
        rel: results.records[0].get(names.rel),
      });
    })
    .catch(err => (
      next(dbError(err))
    ));
}

const detachEvent = (req, res, next) => {
  const session = getSession(req);
  const params = {
    story_id: req.params.story_id,
    user_id: req.user.id,
    event_id: req.params.event_id,
  };
  const names = {
    story: 'story',
    user: 'user',
    linkTo: 'event',
    rel: 'r',
  };
  const storyParams = { id: 'story_id' };
  const eventNode = { name: names.linkTo, label: 'Event' };
  const eventParams = { id: 'event_id' };
  const userParams = { id: 'user_id' };
  return session.run(Stories.detachFrom(storyParams, eventNode, eventParams,
    userParams, names), params)
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
  add,
  deleteStory,
  read,
  update,
  readAll,
  addEventToStory,
  detachEvent,
};
