export const state = () => ({
  testQuestions: []
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
  }
};

export const actions = {
  async getTestQuestions({ commit }, payload) {
    const res = await this.$axios.post(`/test/get-questions`, payload);
    commit("setTestQuestions", res.data);
    return res;
  },
  async submitAnswers({ commit }, payload) {
    const res = await this.$axios.post(`/test/submit`, payload);
    commit("setTestQuestionAnswers", res.data);
    return res;
  }
};
