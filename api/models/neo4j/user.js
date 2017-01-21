import _ from 'lodash';

const User = (_node) => {
  const username = _node.properties.username;
  return _.extend(this, {
    id: _node.properties.id,
    username,
  });
};

module.exports = User;
