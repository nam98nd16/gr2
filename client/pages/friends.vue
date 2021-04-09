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
          @addedFriend="
            fetchFriends(true, person.userId == selectedUser.userId)
          "
          @deletedFriend="
            fetchFriends(true, person.userId == selectedUser.userId)
          "
          @confirmedFriend="
            fetchFriends(true, person.userId == selectedUser.userId)
          "
          @click.native="selectedUser = person"
        />
        <a-pagination
          style="float: right"
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
          class="mb-1"
          v-model="filteredOption"
          button-style="solid"
        >
          <a-radio-button value="all">
            All people
          </a-radio-button>
          <a-radio-button value="onlyMyFriends">
            My friends
          </a-radio-button>
          <a-radio-button value="friendRequests">
            Friend requests
          </a-radio-button>
          <a-radio-button value="requestedFriends">
            Requests sent
          </a-radio-button>
        </a-radio-group>

        <viewable-profile
          v-if="selectedUser"
          :user="selectedUser"
          @addedFriend="fetchFriends(true, true)"
          @deletedFriend="fetchFriends(true, true)"
          @confirmedFriend="fetchFriends(true, true)"
        />

        <div
          v-else
          class="mt-5"
          style="text-align: center; font-size: 1.25rem; word-break: break-word; font-weight: 700;"
        >
          Select people's names to preview their profile
        </div>
      </a-col>
    </a-row>
    <div></div>
  </div>
</template>

<script>
import pageTitle from "../components/page-title.vue";
import searchedPerson from "../components/searched-person.vue";
import { mapState, mapActions, mapMutations } from "vuex";
import ViewableProfile from "../components/viewable-profile.vue";
export default {
  components: { pageTitle, searchedPerson, ViewableProfile },
  data() {
    return {
      keyword: "",
      perPage: 5,
      currentPage: 1,
      search: _.debounce(() => {
        this.fetchFriends();
      }, 300),
      filteredOption: "onlyMyFriends",
      selectedUser: null
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
    async fetchFriends(shouldNotRecount, shouldRefreshCurrentPerson) {
      let payload = {
        keyword: this.keyword,
        filteredOption: this.filteredOption,
        perPage: this.perPage,
        currentPage: this.currentPage
      };
      if (!shouldNotRecount) this.getSearchedFriendsCount(payload);
      await this.searchFriends(payload);
      if (shouldRefreshCurrentPerson)
        this.selectedUser = this.searchedFriends.find(
          f => f.userId == this.selectedUser.userId
        );
    }
  },
  beforeDestroy() {
    this.resetSearchedResults();
  }
};
</script>