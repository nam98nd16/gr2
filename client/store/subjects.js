export const state = () => ({
  allSubjects: [],
  subjects: []
});

export const mutations = {
  setAllSubjects(state, subjects) {
    state.allSubjects = subjects;
  },
  setSubjects(state, subjects) {
    state.subjects = subjects;
  }
};

export const actions = {
  async getAllSubjects({ commit }) {
    const res = await this.$axios.get(`/subjects`);
    commit("setAllSubjects", res.data);
  },
  async getSubjects({ commit} , payload) {
    const res = await this.$axios.post(`/subjects`, payload);
    commit("setSubjects", res.data);
  }
};
