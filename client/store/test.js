export const state = () => ({
  testQuestions: []
});

export const mutations = {
  setTestQuestions(state, questions) {
    state.testQuestions = questions;
  }
};

export const actions = {
  async getTestQuestions({ commit }, payload) {
    const res = await this.$axios.post(`/test/get-questions`, payload);
    commit("setTestQuestions", res.data);
    return res;
  }
};
