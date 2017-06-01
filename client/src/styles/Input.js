import styled from 'styled-components';

export default styled.input`
  background: #fff;
  min-width: 300px;
  transition: 0.2s ease-in;
  text-align: center;
  border-radius: 5px;
  border: 1px solid #eee;
  color: #444;
  padding: 10px;
  font-size: 1em;
  font-family: Karla;
  outline: none;
  &::placeholder {
    color: #ccc;
  };
  &:focus {
    border: 1px solid #ffbf00;
  }
`;
