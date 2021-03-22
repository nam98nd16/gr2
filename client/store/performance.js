export const state = () => ({
  myPerformances: [],
  myRatedPerformances: [],
});

export const mutations = {
  setMyPerformances(state, performances) {
    state.myPerformances = performances;
  }
  ,
  setMyRatedPerformances(state, performances) {
    state.myRatedPerformances = performances;
  }
};

export const actions = {
  async getMyPerformances({ commit }, payload) {
    const res = await this.$axios.post(`/performance`, payload);
    commit("setMyPerformances", res.data);
    return res;
  },
  async getMyRatedPerformances({ commit }, payload) {
    const res = await this.$axios.post(`/performance/rated`, payload);
    commit("setMyRatedPerformances", res.data);
    return res;
  }
};
