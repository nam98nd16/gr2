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
  async updateQuestion({ commit }, payload) {
    const res = await this.$axios.post(`/questions/update`, payload);
    return res;
  },
  async reportQuestion({ commit }, payload) {
    const res = await this.$axios.post(`/questions/report`, payload);
    return res;
  },
  async ignoreReports({ commit }, payload) {
    const res = await this.$axios.post(`/questions/ignore-report`, payload);
    return res;
  },
  async deleteQuestion({ commit }, questionId) {
    const res = await this.$axios.delete(
      `/questions/delete?questionId=${questionId}`
    );
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
  async rejectQuestions({ commit }, payload) {
    const res = await this.$axios.post(`/questions/reject`, payload);
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
