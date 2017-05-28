import React from 'react';
import { Link, Route } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

import Home from './components/Home/Home';
import Login from './containers/Login/Login';
import Register from './containers/Register/Register';
import Verify from './containers/Verify/Verify';
import Resend from './containers/Resend/Resend';
// import Index from './containers/Index/Index';
import Profile from './containers/Profile/Profile';
import About from './components/About';
import Nav from './containers/Nav';
import Logout from './containers/Logout';

const routes = [
  { path: '/top',
    component: Home,
  },
  { path: '/about',
    component: About,
  },
  { path: '/login',
    component: Login,
  },
  { path: '/register',
    component: Register,
  },
  { path: '/verify',
    component: Verify,
  },
  { path: '/home/:profileId',
    component: Profile,
  },
];

const Content = styled.div`
  font-family: 'GT Walsheim';
  height: 100vh;
`;

const Header = styled.div`
  margin: 0;
  display: block;
`;

const Brand = styled.div`
  padding: 20px;
  bottom: 20px;
  display: flex;
  transition: opacity 0.2s ease-in;
  &:hover {
    opacity: 0.8
  }
`;

const SubHead = styled.h2`
  font-size: 20px;
  font-weight: 400;
  display: block;
  margin: 0;
  color: #FFBF1B;
  letter-spacing: 1px;
  padding: 0 5px;
`;

const TopWrapper = styled.div`
  display: flex;
  flex: 1;
`;

const DefaultLink = styled(Link)`
  text-decoration: none;
  flex: 1;
`;

const Logo = styled.img`
  max-width: 70px;
  margin: 0 20px;
  align-self: center;
  flex: 1;
`;

const Wrapper = styled.div`
  flex: 1;
`;

const Footer = styled.div`
  margin-top: 20px;
  font-family: 'Cousine';
  color: #1444FF;
  text-align: center;
  padding: 20px;
`;

const HeaderText = styled.h1`
  font-size: 3em;
  margin: 0;
  color: #1444FF;
  font-family: 'GT Walsheim';
  letter-spacing: 2px;
  text-decoration: none;
`;

const Main = styled.div`
  display: flex;
`;

class App extends React.Component {
  render() {
    const { initialState = {} } = this.props;

    const baseContent = (
      <Content id="content">
        <TopWrapper>
          <DefaultLink to="/">
            <Brand>
              <Logo src="/sondersCir.png" />
              <Header>
                <HeaderText>SONDERS</HeaderText>
                <SubHead>Get Inspired and Inpsire the Others</SubHead>
              </Header>
            </Brand>
          </DefaultLink>
          <Logout />
        </TopWrapper>
        <Main>
          <Nav />
          <Wrapper>
            {routes.map((route, i) => (
              <Route
                key={i}
                path={route.path}
                render={props => (
                  <route.component {...props} routes={route.routes} />
                )}
            />
          ))}
          </Wrapper>
        </Main>
        <Footer>
          by CTRL N CODE 2017
        </Footer>
      </Content>
    );

    if (process.env.NODE_ENV !== 'production') {
      return baseContent;
    }
    const stateJSON = JSON.stringify(initialState).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--');

    return (
      <div id="app">
        <link rel="stylesheet" href="/bundle.css" />
        {baseContent}
        <script dangerouslySetInnerHTML={{ __html: `window.__INITIAL_STATE__ = ${stateJSON}` }} />
        <script src="/bundle.js" />
      </div>
    )
  }
}

module.exports = App;
