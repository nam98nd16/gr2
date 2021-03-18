export const state = () => ({
  myPerformances: []
});

export const mutations = {
  setMyPerformances(state, performances) {
    state.myPerformances = performances;
  }
};

export const actions = {
  async getMyPerformances({ commit }, subjectId) {
    const res = await this.$axios.get(`/performance?subjectId=${subjectId}`);
    commit("setMyPerformances", res.data);
    return res;
  }
};
