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
      @addedFriend="fetchFriends(true)"
      @deletedFriend="fetchFriends(true)"
      @confirmedFriend="fetchFriends(true)"
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
      currentPage: 1,
      search: _.debounce(() => {
        this.fetchFriends();
      }, 300)
    };
  },
  async mounted() {
    this.fetchFriends();
  },
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
    fetchFriends(shouldNotRecount) {
      let payload = {
        keyword: this.keyword,
        perPage: this.perPage,
        currentPage: this.currentPage
      };
      this.searchFriends(payload);
      if (!shouldNotRecount) this.getSearchedFriendsCount(payload);
    }
  }
};
</script>