import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

class ToolTip extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    const Tool = styled.span`
      position: absolute;
      background: rgba(94, 227, 165, 0.84);
      padding: 2px 10px;
      border-radius: 2px;
      left: 20px;
      font-size: 0.8em;
      bottom: -15px;
      z-index: 10;
      &:before {
        content:'';
        width:0;
        height:0;
        position: absolute;
        top: -7px;
        left: 15px;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-bottom: 7px solid rgba(94, 227, 165, 0.84);
      }
    `;
    return (
      <Tool>
        {this.props.tip}
      </Tool>
    );
  }
}

ToolTip.propTypes = {
  tip: PropTypes.string,
};

module.exports = ToolTip;
