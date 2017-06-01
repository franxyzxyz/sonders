import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import styles from './Input.css';
import ToolTip from '../Tooltip';
import StyledInput from '../../styles/Input';

const InputWrapper = styled.div`
  position: relative;
`;
const validateEmail = (value) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(value);
};

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value || '',
      validateValue: '',
      error: '',
      validateError: '',
    };
    this.onChange = this.onChange.bind(this);
    this.validateOnChange = this.validateOnChange.bind(this);
  }

  onChange(e) {
    const value = e.target.value;
    const fieldEmpty = !value ? 'Field cannot be empty' : null;
    const schemaValidationError = this.props.type === 'email' && !validateEmail(value) && 'Not a valid Email';
    const isLengthValid = this.props.minLength && value.length < this.props.minLength && `Must be longer than ${this.props.minLength} characters`;
    const error = fieldEmpty || schemaValidationError || isLengthValid;

    const validateError = this.props.validate && this.state.validateValue !== e.target.value ? 'VALUE DOES NOT MATCH' : '';

    this.props.onChange(this.props.name, value, error || validateError);

    this.setState({
      value,
      error,
      validateError,
    });
  }

  validateOnChange(e) {
    const error = e.target.value !== this.state.value ? 'VALUE DOES NOT MATCH' : null;
    this.setState({
      validateValue: e.target.value,
      validateError: error,
    });
    this.props.onChange(this.props.name, this.state.value, error);
  }

  render() {
    const { type, placeholder, validate, validatePlaceHolder } = this.props;
    const { value, validateValue, error, validateError } = this.state;
    if (validate === 'same') {
      return (
        <div>
          <InputWrapper>
            <StyledInput
              type={type}
              placeholder={placeholder}
              value={value}
              onChange={this.onChange}
            />
            {error &&
              <ToolTip tip={error} />
            }
          </InputWrapper>
          <div className={styles.link}>
            <div />
          </div>
          <InputWrapper>
            <StyledInput
              type={type}
              placeholder={validatePlaceHolder}
              value={validateValue}
              onChange={this.validateOnChange}
            />
            {validateError &&
              <ToolTip tip={validateError} />
            }
          </InputWrapper>
        </div>
      )
    }
    return (
      <InputWrapper>
        <StyledInput
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={this.onChange}
        />
        {error &&
          <ToolTip tip={error} />
        }
      </InputWrapper>
    )
  }
}

Input.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  validate: PropTypes.string,
  validatePlaceHolder: PropTypes.string,
  minLength: PropTypes.number,
};

module.exports = Input;
