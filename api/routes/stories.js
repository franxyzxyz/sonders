import { Router } from 'express';
import Stories from '../models/stories';
import nconf from '../config';
import { schemaValidator } from '../utils/validation';

const router = Router();
const config = nconf.get('stories');

const NEW_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: {
      type: 'string',
      minLength: config.title.minLength,
      maxLength: config.title.maxLength,
    },
  },
  required: ['title'],
};

router.route('/story/self')
  .get(Stories.readAll);

router.route('/story')
  .post(schemaValidator(NEW_SCHEMA), Stories.add);

router.route('/story/:story_id')
  .get(Stories.read)
  .patch(schemaValidator(NEW_SCHEMA), Stories.update)
  .delete(Stories.deleteStory);

router.route('/story/:story_id/event/:event_id')
  .post(Stories.addEventToStory)
  .delete(Stories.detachEvent);

module.exports = router;
