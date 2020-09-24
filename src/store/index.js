import Vue from "vue";
import Vuex from "vuex";

import deploy from "./modules/deploy";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    deploy
  }
});
