import {
  GET_EVENT_SELF,
  POST_LOGIN,
  SET_USER,
  POST_LOGOUT,
  SEND_VERIFICATION,
  POST_REGISTER,
  POST_EVENT_SELF,
} from './constants';

export const getEventSelf = () => ({
  type: GET_EVENT_SELF,
});

export const postEventSelf = data => ({
  type: POST_EVENT_SELF,
  data,
});

export const postLogin = (email, password) => ({
  type: POST_LOGIN,
  email,
  password,
});

export const postLogout = () => ({
  type: POST_LOGOUT,
});

export const retrieveUser = (state, verified) => ({
  type: SET_USER,
  state,
  verified,
});

export const sendVerification = () => ({
  type: SEND_VERIFICATION,
});

export const postRegister = user => ({
  type: POST_REGISTER,
  user,
});
