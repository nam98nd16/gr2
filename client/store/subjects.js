export const state = () => ({
  allSubjects: []
});

export const mutations = {
  setAllSubjects(state, subjects) {
    state.allSubjects = subjects;
  }
};

export const actions = {
  async getAllSubjects({ commit }) {
    const res = await this.$axios.get(`/subjects`);
    commit("setAllSubjects", res.data);
  }
};
