/* eslint-disable no-param-reassign */
import { v2 as cloudinary } from 'cloudinary';
import uuid from 'uuid';
import nconf from '../config';
import { newError } from './errorHandler';

cloudinary.config(nconf.get('CLOUDINARY_URL'));

const imageUpload = params => (
  new Promise((resolve, reject) => {
    const { imageData, userId, mediaSrc } = params;
    if (!imageData) {
      resolve({});
    }
    const imageId = uuid.v4();
    cloudinary.uploader.upload(imageData, {
      tags: userId,
      folder: `${userId}/${mediaSrc}`,
      public_id: imageId,
    })
      .then((image) => {
        const { public_id, bytes, version, width, height, format } = image;
        resolve({
          mediaId: imageId,
          fullId: public_id,
          version,
          size: bytes,
          mediaSource: mediaSrc,
          image: {
            w: width,
            h: height,
            imageType: format,
          },
        });
      })
      .catch(() => {
        reject(newError(400, 'Error during upload process'));
      });
  })
);

const deleteImage = publidId => (
  new Promise((resolve, reject) => {
    if (!publidId) {
      resolve({});
    }
    cloudinary.uploader.destroy(publidId)
      .then(() => {
        // { result: 'ok' }
        resolve({
          delete: true,
        });
      })
      .catch(() => {
        reject(newError(400, 'Error during image deletion'));
      });
  })
);

module.exports = {
  imageUpload,
  deleteImage,
};
