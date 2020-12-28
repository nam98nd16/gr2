export const state = () => ({
  allQuestions: [],
  availableAssignees: []
});

export const mutations = {
  setAllQuestions(state, questions) {
    state.allQuestions = questions;
  },
  setAvailableAssignees(state, assignees) {
    state.availableAssignees = assignees;
  }
};

export const actions = {
  async proposeQuestion({ commit }, payload) {
    const res = await this.$axios.post(`/questions/propose`, payload);
    return res;
  },
  async getAllQuestions({ commit }) {
    const res = await this.$axios.get(`/questions/all`);
    commit("setAllQuestions", res.data);
    return res;
  },
  async approveQuestions({ commit }, payload) {
    const res = await this.$axios.post(`/questions/approve`, payload);
    return res;
  },
  async getAvailableAssignees({ commit }) {
    const res = await this.$axios.get(`/questions/assignees`);
    commit("setAvailableAssignees", res.data);
    return res;
  },
  async setAssignees({ commit }, payload) {
    const res = await this.$axios.post(`/questions/assignees`, payload);
    return res;
  }
};
