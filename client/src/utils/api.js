import axios from 'axios';
import Auth from './auth';

const auth = new Auth();
const API_URL = process.env.API_URL;

export const postLogin = (username, password) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/login`, {
      username,
      password,
    })
    .then((result) => {
      resolve(result.data);
    })
    .catch((error) => {
      reject(error);
    });
  });
};

export const postRegister = (username, password) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/register`, {
      username,
      password,
    })
    .then((result) => {
      resolve(result.data);
    })
    .catch((error) => {
      reject(error)
    });
  });
};

export const getEvents = () => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/event/self`, {
      headers: {
        Authorization: `Bearer ${auth.getToken()}`,
      },
    })
    .then((result) => {
      resolve(result.data)
    })
    .catch((error) => {
      console.log(error)
      reject(error)
    })
  })
}
