import { axios } from "./base/ServerJars";

export default {
  fetchLatest(param) {
    return axios.get("/fetchLatest", { params: param });
  },

  fetchAll(param) {
    return axios.get(`/fetchAll/${param.type}`);
  },

  fetchTypes(param) {
    return axios.get("/fetchTypes", { params: param });
  }
};
