import axios from 'axios';

const apiFutebol = axios.create({
  baseURL: process.env.HOST_API_FUTEBOL,
  headers: {
    Authorization: `Bearer ${process.env.TOKEN_API_FUTEBOL}`,
  },
});

export default apiFutebol;
