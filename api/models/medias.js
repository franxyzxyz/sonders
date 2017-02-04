import { imageUpload } from '../utils/imageUpload';

const upload = (req, res, next) => {
  const params = {
    imageData: req.body.imageData,
    userId: req.user.id,
    mediaSrc: req.body.mediaSource,
  };
  return imageUpload(params)
    .then((result) => {
      const { mediaId, version, size, image, fullId } = result;
      res.status(200).json({
        message: 'Upload successful',
        mediaId,
        version,
        size,
        image,
        fullId,
      });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  upload,
};
