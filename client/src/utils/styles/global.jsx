import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const LinkTo = styled(Link)`
  padding: 10px 20px;
  margin-right: 20px;
  font-family: 'Cousine';
  font-size: 0.9em;
  display: block;
  cursor: pointer;
  background-size: 200% 100%;
  background-image: linear-gradient(to right, #FFA22C 50%, #1444FF  50%);
  transition: background-position 0.2s ease-in;
  -webkit-background-clip: text, border-box;
  background-clip: text, border-box;
  color: transparent;
  &:hover {
    background-position: -100% 0;
  }
`;

export const LinkButton = styled.button`
  border: 0px;
  align-self: center;
  padding: 10px 20px;
  margin-right: 20px;
  font-family: 'Cousine';
  font-size: 0.9em;
  display: block;
  cursor: pointer;
  background-size: 200% 100%;
  background-image: linear-gradient(to right, #FFA22C 50%, #1444FF  50%);
  transition: background-position 0.2s ease-in;
  -webkit-background-clip: text, border-box;
  background-clip: text, border-box;
  color: transparent;
  &:hover {
    background-position: -100% 0;
  }
`;
