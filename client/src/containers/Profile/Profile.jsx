import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import styles from './Profile.css';

class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <div>Profile</div>
      </div>
    )
  }
}

Profile.propTypes = {
};

module.exports = connect(
)(Profile);
