import Axios from "axios";

const config = {
  baseURL: "/api",
  timeout: 60000,
  responseType: "json",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
  }
};

const axios = Axios.create(config);

export { axios };
