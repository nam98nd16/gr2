export const state = () => ({
  allUsers: [],
  users: [],
  usersCount: []
});

export const mutations = {
  setAllUsers(state, allUsers) {
    state.allUsers = allUsers;
  },
  setUsers(state, users) {
    state.users = users;
  },
  setUsersCount(state, usersCount) {
    state.usersCount = usersCount;
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
  async getUsers({ commit }, payload) {
    const res = await this.$axios.post(`/accounts/users`, payload);
    commit("setUsers", res.data);
    return res;
  },
  async getUsersCount({ commit }, payload) {
    const res = await this.$axios.post(`/accounts/users/count`, payload);
    commit("setUsersCount", res.data);
    return res.data;
  },
  async updateUsersRole({ commit }, payload) {
    const res = await this.$axios.post(`/accounts/update-roles`, payload);
    return res;
  },
  async updateUserRole({ commit }, payload) {
    const res = await this.$axios.post(`/accounts/update-role`, payload);
    return res.data;
  },
  async updateAvatar({ commit }, payload) {
    const res = await this.$axios.post(`/accounts/update-avatar`, payload);
    return res.data;
  },
  async getAvatar({ commit }) {
    const res = await this.$axios.get(`/accounts/avatar`);
    return res.data;
  }
};
