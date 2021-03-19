export const state = () => ({
  myPerformances: []
});

export const mutations = {
  setMyPerformances(state, performances) {
    state.myPerformances = performances;
  }
};

export const actions = {
  async getMyPerformances({ commit }, payload) {
    const res = await this.$axios.post(`/performance`, payload);
    commit("setMyPerformances", res.data);
    return res;
  }
};
