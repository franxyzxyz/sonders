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

module.exports = {
  fieldMatch,
};
