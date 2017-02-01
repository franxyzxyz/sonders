import { Router } from 'express';
import Events from '../models/events';
import nconf from '../config';
import { schemaValidator } from '../utils/validation';
import { category } from '../utils/events';

const router = Router();
const config = nconf.get('events');

const NEW_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: {
      type: 'string',
      minLength: config.title.minLength,
      maxLength: config.title.maxLength,
    },
    type: {
      type: 'string',
      uniqueItems: true,
      enum: category,
    },
    date: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ['title', 'type', 'date'],
};

const UPDATE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: NEW_SCHEMA.properties,
};

router.route('/event')
  .post(schemaValidator(NEW_SCHEMA), Events.add);

router.route('/event/:event_id')
  .patch(Events.update)
  .delete(Events.deleteEvent);

module.exports = router;
