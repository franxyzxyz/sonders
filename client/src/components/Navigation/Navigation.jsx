import React from 'react';
import { browserHistory, Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import styles from './Navigation.css';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout() {
    this.props.auth.logout();
    browserHistory.push('/login');
  }

  render() {
    const { auth } = this.props;
    const items = auth.isLoggedIn() ?
                  <a onClick={this.logout}>LOGOUT</a> :
                  <Link to="/login">LOGIN</Link>;

    const loggedInItems = (
      <div className={styles.navWrapper}>
        <div className={styles.navComponent}>
          <Link to="/profile/123">PROFILE</Link>
        </div>
        <div className={styles.navComponent}>
          <a onClick={this.logout}>LOGOUT</a>
        </div>
      </div>
    );

    const publicItems = (
      <div className={styles.navWrapper}>
        <div className={styles.navComponent}>
          <Link to="/login">LOGIN</Link>
        </div>
      </div>
    );

    return (
      <div className={styles.nav}>
        <div className={styles.logoWrapper}>
          <Link to="/"><div className={styles.logo}>SONDERS</div></Link>
        </div>

        <div className={styles.flexDummy}>
          <div />
        </div>
        {auth.isLoggedIn() ?
          loggedInItems : publicItems
        }
      </div>
    )
  }
}

Navigation.propTypes = {
  auth: React.PropTypes.shape({
    logout: React.PropTypes.func,
  }),
};

module.exports = Navigation;
