import Ajv from 'ajv';

const ajv = new Ajv({ removeAdditional: true });

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

const schemaValidatorBasic = (schema, body) => {
  const test = body;
  return ajv.validate(schema, test);
};

module.exports = {
  schemaValidator,
  schemaValidatorBasic,
};
