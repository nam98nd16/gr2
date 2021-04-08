export const state = () => ({
  searchedFriends: [],
  searchedFriendsCount: 0
});

export const mutations = {
  setSearchedFriends(state, searchedFriends) {
    state.searchedFriends = searchedFriends;
  },
  setSearchedFriendsCount(state, searchedFriendsCount) {
    state.searchedFriendsCount = searchedFriendsCount;
  },
  resetSearchedResults(state) {
    state.searchedFriends = [];
    state.searchedFriendsCount = 0;
  }
};

export const actions = {
  async searchFriends({ commit }, payload) {
    const res = await this.$axios.post(`/friends/search`, payload);
    commit("setSearchedFriends", res.data);
    return res;
  },
  async getSearchedFriendsCount({ commit }, payload) {
    const res = await this.$axios.post(`/friends/search/count`, payload);
    commit("setSearchedFriendsCount", res.data);
    return res;
  },
  async addFriend({ commit }, payload) {
    const res = await this.$axios.post(`/friends/add`, payload);
    return res;
  },
  async deleteFriend({ commit }, userId) {
    const res = await this.$axios.delete(`/friends/delete?userId=${userId}`);
    return res;
  },
  async confirmFriend({ commit }, payload) {
    const res = await this.$axios.post(`/friends/confirm`, payload);
    return res;
  }
};
