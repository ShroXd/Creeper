const state = () => ({
  deployingApp: {},
  initializeServerFileLogs: "",
  deployLogs: [],
  currentStageDoing: {},
  finishDeployInformation: {},
  failureDeployInformation: {}
});

const getters = {
  getDeployingApp(state) {
    return state.deployingApp;
  },
  getInitializeServerFileLogs(state) {
    return state.initializeServerFileLogs;
  },
  getDeployLogs(state) {
    return state.deployLogs;
  },
  getCurrentStageDoing(state) {
    return state.currentStageDoing;
  },
  getFinishDeployInformation(state) {
    return state.finishDeployInformation;
  },
  getFailureDeployInformation(state) {
    return state.failureDeployInformation;
  }
};

const mutations = {
  setDeployingApp(state, deployingApp) {
    state.deployingApp = deployingApp;
  },
  setInitializeServerFileLogs(state, initializeServerFileLogs) {
    state.initializeServerFileLogs = initializeServerFileLogs;
  },
  setDeployLogs(state, deployLogs) {
    state.deployLogs = deployLogs;
  },
  setCurrentStageDoing(state, currentStageDoing) {
    state.currentStageDoing = currentStageDoing;
  },
  setFinishDeployInformation(state, finishDeployInformation) {
    state.finishDeployInformation = finishDeployInformation;
  },
  setFailureDeployInformation(state, failureDeployInformation) {
    state.failureDeployInformation = failureDeployInformation;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};
