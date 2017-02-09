import _ from 'lodash';

const Story = _node => (
  _.extend(this, _node.properties)
);

module.exports = {
  Story,
};
