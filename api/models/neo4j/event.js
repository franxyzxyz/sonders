import _ from 'lodash';

const Event = _node => (
  _.extend(this, _node.properties)
);

module.exports = {
  Event,
};
