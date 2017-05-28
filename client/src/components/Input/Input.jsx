import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory, Link } from 'react-router';
import styles from './Input.css';

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value || '',
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.props.onChange(this.props.name, e.target.value);
    this.setState({
      value: e.target.value,
    });
  }

  render() {
    const { type, placeholder, error } = this.props;
    const { value } = this.state;
    return (
      <div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          className={styles.basicInput}
          onChange={this.onChange}
        />
        <div className={styles.error}>{error}</div>
      </div>
    )
  }
}

Input.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
};

module.exports = Input;
