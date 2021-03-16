export const state = () => ({
  allUsers: []
});

export const mutations = {
  setAllUsers(state, allUsers) {
    state.allUsers = allUsers;
  }
};

export const actions = {
  async updateProfile({ commit }, payload) {
    const res = await this.$axios.post(`/accounts/update`, payload);
    return res;
  },
  async getAllUsers({ commit }) {
    const res = await this.$axios.get(`/accounts/all`);
    commit("setAllUsers", res.data);
    return res;
  },
  async updateUsersRole({ commit }, payload) {
    const res = await this.$axios.post(`/accounts/update-roles`, payload);
    return res;
  }
};
