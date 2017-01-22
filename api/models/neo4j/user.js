import _ from 'lodash';

const User = (_node) => {
  const { id, username } = _node.properties;
  return _.extend(this, {
    id,
    username,
  });
};

module.exports = User;
