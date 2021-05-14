<template>
  <div>
    <page-title title="Friends" />
    <a-row :gutter="4" type="flex" align="top" justify="start">
      <a-col :md="6" :xs="24">
        <a-input
          class="mb-1"
          placeholder="Search for people"
          v-model="keyword"
          @change="search"
        />
      </a-col>
      <a-col :md="18" :xs="24">
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
      </a-col>
    </a-row>
    <a-row :gutter="4" type="flex" align="top" justify="start">
      <a-col :md="6" :xs="24">
        <a-spin :spinning="loading">
          <searched-person
            v-for="person in searchedFriends"
            :key="person.username"
            :person="person"
            @addedFriend="
              fetchFriends(
                true,
                'added',
                selectedUser && person.userId == selectedUser.userId
              )
            "
            @deletedFriend="
              fetchFriends(
                true,
                'deleted',
                selectedUser && person.userId == selectedUser.userId
              )
            "
            @confirmedFriend="
              fetchFriends(
                true,
                'confirmed',
                selectedUser && person.userId == selectedUser.userId
              )
            "
            @viewPerformance="handleViewPerformance(person)"
            @click.native="selectedUser = _.cloneDeep(person)"
          />
          <a-pagination
            style="float: right"
            v-show="searchedFriendsCount > perPage"
            class="mt-2 mb-1"
            v-model="currentPage"
            :pageSize="perPage"
            showLessItems
            :total="searchedFriendsCount"
          />
        </a-spin>
      </a-col>
      <a-col :md="18" :xs="24">
        <viewable-profile
          ref="viewableProfile"
          v-if="selectedUser"
          :user="selectedUser"
          @addedFriend="fetchFriends(true, 'added', true)"
          @deletedFriend="fetchFriends(true, 'deleted', true)"
          @confirmedFriend="fetchFriends(true, 'confirmed', true)"
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
      selectedUser: null,
      loading: false
    };
  },
  mounted() {
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
    async fetchFriends(shouldNotRecount, refreshReason, shouldRefresh) {
      this.loading = true;
      let payload = {
        keyword: this.keyword,
        filteredOption: this.filteredOption,
        perPage: this.perPage,
        currentPage: this.currentPage
      };
      if (!shouldNotRecount) this.getSearchedFriendsCount(payload);
      await this.searchFriends(payload);
      this.loading = false;
      if (this.selectedUser && shouldRefresh) {
        if (refreshReason == "added") {
          delete this.selectedUser.hasRequested;
          delete this.selectedUser.hasBeenRequested;
          this.$set(this.selectedUser, "hasBeenRequested", { confirmed: "0" });
        } else if (refreshReason == "deleted") {
          this.selectedUser.hasRequested = undefined;
          this.selectedUser.hasBeenRequested = undefined;
        } else if (refreshReason == "confirmed") {
          if (this.selectedUser.hasRequested)
            this.selectedUser.hasRequested.confirmed = "1";
          else this.selectedUser.hasBeenRequested.confirmed = "1";
        }
      }
    },
    async handleViewPerformance(person) {
      this.selectedUser = _.cloneDeep(person);
      await this.$nextTick();
      this.$refs.viewableProfile.isViewingPerformance = true;
    }
  },
  beforeDestroy() {
    this.resetSearchedResults();
  }
};
</script>