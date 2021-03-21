export const state = () => ({
  testQuestions: [],
  currentRating: null
});

export const mutations = {
  setTestQuestions(state, questions) {
    state.testQuestions = questions;
  },
  setTestQuestionAnswers(state, questions) {
    state.testQuestions = state.testQuestions.map(question => ({
      ...question,
      answerId: questions.find(quest => quest.questionId == question.questionId)
        .answerId
    }));
  },
  setCurrentRating(state, currentRating) {
    state.currentRating = currentRating;
  },
};

export const actions = {
  async getTestQuestions({ commit }, payload) {
    const res = await this.$axios.post(`/test/get-questions`, payload);
    commit("setTestQuestions", res.data);
    return res;
  },
  async getRatedQuestion({ commit }, payload) {
    const res = await this.$axios.post(`/test/get-rated-question`, payload);
    return res.data;
  },
  async getRating({ commit }, payload) {
    const res = await this.$axios.post(`/test/get-rating`, payload);
    commit("setCurrentRating", res.data);
    return res.data;
  },
  async submitAnswers({ commit }, payload) {
    const res = await this.$axios.post(`/test/submit`, payload);
    commit("setTestQuestionAnswers", res.data);
    return res;
  },
  async submitRatedAnswer({ commit }, payload) {
    const res = await this.$axios.post(`/test/submit-rated`, payload);
    return res.data;
  }
};
