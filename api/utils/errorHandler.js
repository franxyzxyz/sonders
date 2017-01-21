const newError = (status, description) => new Error(JSON.stringify({ description, status }));

module.exports = {
  newError,
};
