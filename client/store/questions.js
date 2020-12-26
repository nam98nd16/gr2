export const state = () => ({
  allSubjects: []
});

export const mutations = {};

export const actions = {
  async proposeQuestion({ commit }, payload) {
    const res = await this.$axios.post(`/questions/propose`, payload);
    return res;
  }
};
