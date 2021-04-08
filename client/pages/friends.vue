<template>
  <div>
    <page-title title="Friends" />
    <a-row :gutter="4" type="flex" align="top" justify="start">
      <a-col :span="6">
        <a-input
          placeholder="Search for people"
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
        <a-pagination
          v-show="searchedFriendsCount > perPage"
          class="mt-2"
          v-model="currentPage"
          :pageSize="perPage"
          showLessItems
          :total="searchedFriendsCount"
        />
      </a-col>
      <a-col :span="18">
        <a-radio-group
          class="mb-2"
          v-model="filteredOption"
          button-style="solid"
        >
          <a-radio-button value="all">
            All people
          </a-radio-button>
          <a-radio-button value="onlyMyFriends">
            Only my friends
          </a-radio-button>
          <a-radio-button value="friendRequests">
            Friend requests
          </a-radio-button>
          <a-radio-button value="requestedFriends">
            Requests sent
          </a-radio-button>
        </a-radio-group>
      </a-col>
    </a-row>
    <div></div>
  </div>
</template>

<script>
import pageTitle from "../components/page-title.vue";
import searchedPerson from "../components/searched-person.vue";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  components: { pageTitle, searchedPerson },
  data() {
    return {
      keyword: "",
      perPage: 5,
      currentPage: 1,
      search: _.debounce(() => {
        this.fetchFriends();
      }, 300),
      filteredOption: "onlyMyFriends"
    };
  },
  async mounted() {
    this.fetchFriends();
  },
  watch: {
    filteredOption(newVal) {
      this.currentPage = 1;
      this.fetchFriends();
    },
    currentPage(newVal) {
      this.fetchFriends();
    }
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
    ...mapMutations({
      resetSearchedResults: "friends/resetSearchedResults"
    }),
    fetchFriends(shouldNotRecount) {
      let payload = {
        keyword: this.keyword,
        filteredOption: this.filteredOption,
        perPage: this.perPage,
        currentPage: this.currentPage
      };
      this.searchFriends(payload);
      if (!shouldNotRecount) this.getSearchedFriendsCount(payload);
    }
  },
  beforeDestroy() {
    this.resetSearchedResults();
  }
};
</script>