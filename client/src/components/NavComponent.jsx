import React from 'react';
import PropTypes from 'prop-types';
import { LinkTo } from '../utils/styles/global';

class NavComponent extends React.Component {
  render() {
    const { display } = this.props;
    if (display) {
      return (
        <LinkTo to={this.props.to}>{this.props.label}</LinkTo>
      );
    }
    return null;
  }
}

NavComponent.propTypes = {
  display: PropTypes.bool,
  label: PropTypes.string,
  to: PropTypes.string,
};

module.exports = NavComponent;
