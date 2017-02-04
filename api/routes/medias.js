import { Router } from 'express';
import Medias from '../models/medias';
import nconf from '../config';
import { schemaValidator } from '../utils/validation';

const router = Router();
const config = nconf.get('media');

const UPLOAD_IMAGE = {
  type: 'object',
  additionalProperties: false,
  properties: {
    imageData: {
      type: 'string',
      maxLength: config.image.maxLength,
    },
    mediaSource: {
      type: 'string',
      enum: ['event', 'user', 'story'],
    },
  },
  required: ['imageData', 'mediaSource'],
};

router.route('/media/upload')
  .post(schemaValidator(UPLOAD_IMAGE), Medias.upload);

module.exports = router;
