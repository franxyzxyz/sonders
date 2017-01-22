import Ajv from 'ajv';

const ajv = new Ajv({ removeAdditional: true });

const fieldMatch = (body, allowedFields) => {
  if (Object.keys(body).length !== allowedFields.length) {
    return false;
  }
  let result = true;
  let i = 0;
  while (result && i < allowedFields.length) {
    if (!body[allowedFields[i]]) {
      result = false;
    }
    i += 1;
  }
  return result;
};

const schemaValidator = schema => (
  (req, res, next) => {
    if (!ajv.validate(schema, req.body)) {
      const { message } = ajv.errors[0];
      return res.status(400).json({
        message,
      });
    }
    return next();
  }
);

module.exports = {
  fieldMatch,
  schemaValidator,
};
