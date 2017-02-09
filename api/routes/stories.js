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

router.route('/story')
  .post(schemaValidator(NEW_SCHEMA), Stories.add);

router.route('/story/:story_id')
  .delete(Stories.deleteStory);

module.exports = router;
