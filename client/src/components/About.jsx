import React from 'react';
import styled from 'styled-components';

const Para = styled.p`
  font-family: 'Cousine';
`;

const Header = styled.div`
  font-family: 'GT Walsheim';
  font-size: 2em;
  font-weight: 700;
`;

const Wrapper = styled.div`
  padding: 20px;
`;

class About extends React.Component {
  render() {
    return (
      <Wrapper>
        <Header>About</Header>
        <Para>
        Sonders is a platform to get inspired by others' life stories whilst inspiring the others with your very own life journey.
        </Para>
        <Para>
        Sonders 是一個從別人的生活故事獲得靈感的平台，同時也為自己的人生旅程激發人心。
        </Para>
      </Wrapper>
    )
  }
}

module.exports = About;
