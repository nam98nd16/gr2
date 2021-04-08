<template>
  <div>
    <page-title title="Friends" />
    <a-input
      placeholder="Search for people"
      style="width: 300px"
      v-model="keyword"
      @change="search"
    />
    <searched-person
      v-for="person in searchedFriends"
      :key="person.username"
      :person="person"
    />
  </div>
</template>

<script>
import pageTitle from "../components/page-title.vue";
import searchedPerson from "../components/searched-person.vue";
import { mapState, mapActions } from "vuex";
export default {
  components: { pageTitle, searchedPerson },
  data() {
    return {
      keyword: "",
      perPage: 10,
      currentPage: 1
    };
  },
  async mounted() {},
  computed: {
    ...mapState({
      searchedFriends: state => state.friends.searchedFriends,
      searchedFriendsCount: state => state.friends.searchedFriendsCount
    })
  },
  methods: {
    ...mapActions({
      searchFriends: "friends/searchFriends",
      getSearchedFriendsCount: "friends/getSearchedFriendsCount"
    }),
    search() {
      let payload = {
        keyword: this.keyword,
        perPage: this.perPage,
        currentPage: this.currentPage
      };
      this.searchFriends(payload);
      this.getSearchedFriendsCount(payload);
    }
  }
};
</script>