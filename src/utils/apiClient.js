const axios = require("axios");
require("dotenv").config();

const apiClient = axios.create({
  baseURL: process.env.BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  if (process.env.ACCESS_TOKEN) {
    config.headers.Authorization = `Bearer ${process.env.ACCESS_TOKEN}`;
  }
  return config;
});

module.exports = apiClient;
