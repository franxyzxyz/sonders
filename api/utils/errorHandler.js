const newError = (status, description) => new Error(JSON.stringify({ description, status }));

const dbError = err => (
  err.code === 'ECONNREFUSED' ? newError(400, 'Error with DB connection') : err
);

module.exports = {
  newError,
  dbError,
};
