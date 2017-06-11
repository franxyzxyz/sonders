import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './Login.css';
import Loading from '../../components/Loading/Loading';
import { postLogin, postLogout } from '../../actions';
import { POST_LOGIN } from '../../actions/constants';
import Input from '../../styles/Input';
import Button from '../../styles/Button';
import TextButton from '../../styles/TextButton';

class Login extends React.Component {
  constructor(props) {
    super(props);
    const { dispatch } = this.props;
    this.login = () => {
      dispatch(postLogin(this.email.value, this.password.value));
    };
  }

  componentDidMount() {
    const isFromLogout = this.props.location && this.props.location.state.logout;
    if (!isFromLogout && this.props.loggedIn) {
      this.props.history.push('/top');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loggedIn) {
      this.props.history.push('/top');
    }
  }

  render() {
    const { request, error } = this.props;
    return (
      <div className={styles.title}>
        <div className={styles.loginBox}>
          {request ?
            <Loading /> :
            <div className={styles.loginContent}>
              {error &&
                <div className={styles.hint}>{error} Please try again</div>
              }
              <Input type="email" placeholder="Email" innerRef={(c) => { this.email = c; }} />
              <div className={styles.link}>
                <div />
              </div>
              <Input type="password" placeholder="Password" innerRef={(c) => { this.password = c; }} />
              <div className={styles.link}>
                <div />
              </div>
              <div className={styles.loginAction}>
                <Button onClick={this.login}>Log In</Button>
              </div>
              <TextButton onClick={()=>{}}>Forgot password?</TextButton>
            </div>
          }
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func,
  request: PropTypes.bool,
  loggedIn: PropTypes.bool,
  error: PropTypes.string,
};

const mapStateToProps = state => ({
  error: state.requestError[POST_LOGIN],
  request: state.currentRequest[POST_LOGIN],
  loggedIn: state.loggedIn,
});

module.exports = connect(
  mapStateToProps,
)(Login);
