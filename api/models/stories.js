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
}

module.exports = {
  add,
  deleteStory,
};
