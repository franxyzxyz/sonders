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
  return new Promise(async (resolve, reject) => {
    const token = await auth.getToken();
    axios.get(`${API_URL}/event/self`, {
      headers: {
        Authorization: `Bearer ${token}`,
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

export const postEvents = (data) => {
  return new Promise(async (resolve, reject) => {
    const token = await auth.getToken();
    axios.post(`${API_URL}/event/self`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => {
      console.log(result.data)
      resolve(result.data)
    })
    .catch((error) => {
      console.log(error)
      reject(error)
    })
  })
  // 'title', 'type', 'startDate', 'endDate'
}
