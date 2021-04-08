export const state = () => ({
  searchedFriends: [],
  searchedFriendsCount: []
});

export const mutations = {
  setSearchedFriends(state, searchedFriends) {
    state.searchedFriends = searchedFriends;
  },
  setSearchedFriendsCount(state, searchedFriendsCount) {
    state.searchedFriendsCount = searchedFriendsCount;
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
  }
};
