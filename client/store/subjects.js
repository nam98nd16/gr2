export const state = () => ({
  allSubjects: [],
  subjects: [],
  subjectCount: [],
  nonExpertUsers: []
});

export const mutations = {
  setAllSubjects(state, subjects) {
    state.allSubjects = subjects;
  },
  setSubjects(state, subjects) {
    state.subjects = subjects;
  },
  setSubjectCount(state, subjectCount) {
    state.subjectCount = subjectCount;
  },
  setNonExpertUsers(state, nonExpertUsers) {
    state.nonExpertUsers = nonExpertUsers;
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
  },
  async getSubjectCount({ commit} , payload) {
    const res = await this.$axios.post(`/subjects/count`, payload);
    commit("setSubjectCount", res.data);
    return res.data;
  },
  async getNonExpertUsers({ commit} , keyword) {
    const res = await this.$axios.get(`/subjects/non-experts?key=${keyword}`);
    commit("setNonExpertUsers", res.data);
    return res.data;
  },
  async addSubject({ commit} , payload) {
    const res = await this.$axios.post(`/subjects/add`, payload);
    return res.data;
  },
  async updateSubject({ commit} , payload) {
    const res = await this.$axios.post(`/subjects/update`, payload);
    return res.data;
  },
  async removeSubject({ commit} , subjectId) {
    const res = await this.$axios.delete(`/subjects?subjectId=${subjectId}`);
    return res.data;
  }
};
