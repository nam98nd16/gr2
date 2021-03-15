export const state = () => ({});

export const mutations = {};

export const actions = {
  async updateProfile({ commit }, payload) {
    const res = await this.$axios.post(`/accounts/update`, payload);
    return res;
  }
};
