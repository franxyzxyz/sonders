/* eslint-disable react/forbid-prop-types, react/no-danger */
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import styles from './Index.css';
import Navigation from '../../components/Navigation/Navigation';

class Index extends React.Component {
  render() {
    let children = null;
    if (this.props.children) {
      children = React.cloneElement(this.props.children, {
        auth: this.props.route.auth,
      });
    }

    const baseContent = (
      <div id="content" className={styles.page}>
        <Navigation auth={this.props.route.auth} />
        <div className={styles.content}>
          {children}
        </div>
        <div className={styles.footer}>
          by <a href="http://www.ctrlncode.com/" target="_blank" rel="noreferrer noopener external">CTRL N Code LTD.</a> 2017
        </div>
      </div>
    );

    const renderedProps = process.env.NODE_ENV !== 'production' ?
      baseContent : (<html lang="en-US">
        <head>
          <meta charSet="utf-8" />
          <title>Sonders</title>
          <link href="https://fonts.googleapis.com/css?family=Karla" rel="stylesheet" />
          <link rel="stylesheet" href="/bundle.css" />
        </head>
        <body>
          {baseContent}
          <script dangerouslySetInnerHTML={{ __html: this.props.initialState }} />
          <script src="/bundle.js" />
        </body>
      </html>);
    return renderedProps;
  }
}

Index.propTypes = {
  children: React.PropTypes.any,
  initialState: React.PropTypes.any,
  route: React.PropTypes.shape({
    auth: React.PropTypes.shape({}),
  }),
};

const mapStateToProps = (state) => {
  const stateJSON = JSON.stringify(state).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--');
  return {
    initialState: `window.__INITIAL_STATE__ = ${stateJSON}`,
  };
};

module.exports = connect(
  mapStateToProps,
)(Index);
