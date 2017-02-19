import React from 'react';
import styles from './Loading.css';

class Loading extends React.Component {
  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loadingBox}>
          SENDING<br/>REQUEST
        </div>
      </div>
    )
  }
}

module.exports = Loading;
