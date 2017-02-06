import { Router } from 'express';
import _ from 'lodash';
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
    imageData: {
      type: 'string',
      maxLength: nconf.get('media').image.maxLength,
    },
  },
  required: ['title', 'type', 'date'],
};

const UPDATE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: _.omit(NEW_SCHEMA.properties, 'imageData'),
};

const UPDATE_IMAGE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    imageData: {
      type: 'string',
      maxLength: nconf.get('media').image.maxLength,
    },
  },
  required: ['imageData'],
};

router.route('/event/self')
  .get(Events.readAll)
  .post(schemaValidator(NEW_SCHEMA), Events.add);

router.route('/event/:event_id')
  .get(Events.read)
  .patch(schemaValidator(UPDATE_SCHEMA), Events.update)
  .delete(Events.deleteEvent);

router.route('/event/:event_id/image')
  .patch(schemaValidator(UPDATE_IMAGE_SCHEMA), Events.updateImage);

module.exports = router;
