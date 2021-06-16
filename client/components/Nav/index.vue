<template>
  <div>
    <a-menu v-model="current" mode="horizontal">
      <a-menu-item key="index">
        <nuxt-link :to="'/'"> <i class="fas fa-home mr-2"></i>Home </nuxt-link>
      </a-menu-item>
      <a-menu-item key="test">
        <nuxt-link :to="'/test'">
          <i class="fas fa-running mr-2"></i>Training
        </nuxt-link>
      </a-menu-item>
      <a-menu-item key="manage-question">
        <nuxt-link :to="'/manage-question'">
          <i class="fas fa-question-circle mr-2"></i>Question Management
        </nuxt-link>
      </a-menu-item>
      <a-menu-item key="manage-subject">
        <nuxt-link :to="'/manage-subject'">
          <i class="fas fa-book-open mr-2"></i>
          {{ isAdmin ? "Subject Management" : "Subjects" }}
        </nuxt-link>
      </a-menu-item>
      <a-menu-item key="performance">
        <nuxt-link :to="'/performance'">
          <i class="fas fa-chart-line mr-2"></i>Performance
        </nuxt-link>
      </a-menu-item>
      <a-menu-item key="leaderboard">
        <nuxt-link :to="'/leaderboard'">
          <i class="fas fa-crown mr-2"></i>Leaderboard
        </nuxt-link>
      </a-menu-item>
      <a-menu-item key="friends">
        <nuxt-link :to="'/friends'">
          <i class="fas fa-user-friends mr-2"></i>Friends
        </nuxt-link>
      </a-menu-item>
      <a-menu-item v-if="isAdmin" key="manage-user">
        <nuxt-link :to="'/manage-user'">
          <i class="fas fa-users-cog mr-2"></i>User Management
        </nuxt-link>
      </a-menu-item>
      <a-menu-item v-if="!isGuest" key="profile">
        <nuxt-link :to="'/profile'">
          <avatar
            class="mr-2"
            :userId="currentUser.userId"
            :username="currentUser.username"
            :isMyAvatar="true"
            nullAvatarFontsize="16px"
            nullAvatarFontweight="300"
            diameter="28px"
            lineHeight="26px"
          />{{ getProfileName }}
        </nuxt-link>
      </a-menu-item>
      <a-menu-item v-if="!isGuest" @click="handleLogout" key="logout">
        <i class="fas fa-sign-out-alt mr-2"></i>Log out
      </a-menu-item>
      <a-menu-item v-if="isGuest" key="login">
        <nuxt-link :to="'/login'">
          <i class="fas fa-sign-in-alt mr-2"></i>Log in
        </nuxt-link>
      </a-menu-item>
      <a-menu-item v-if="isGuest" key="register">
        <nuxt-link :to="'/register'">
          <i class="fas fa-user-plus mr-2"></i>Sign up
        </nuxt-link>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
import { mapMutations, mapState } from "vuex";
import Avatar from "../avatar.vue";
export default {
  components: { Avatar },
  data() {
    return {
      current: null,
      currentUser: jwt_decode(localStorage.getItem("token"))
    };
  },
  mounted() {
    let curRoute = this.$route.name;
    this.current = [curRoute];
    this.setCurrentRoute(curRoute);
  },
  watch: {
    currentRoute(newVal) {
      if (this.current[0] != newVal) this.current = [newVal];
    },
    current(newVal) {
      if (this.currentRoute != newVal[0]) this.setCurrentRoute(newVal[0]);
    }
  },
  computed: {
    ...mapState({
      currentRoute: state => state.currentRoute
    }),
    getProfileName() {
      return this.currentUser.username;
    },
    isAdmin() {
      return this.currentUser.role == 0;
    },
    isGuest() {
      return this.currentUser.role == 5;
    }
  },
  methods: {
    ...mapMutations({
      setUserAvatar: "setUserAvatar",
      setCurrentRoute: "setCurrentRoute"
    }),
    handleLogout() {
      localStorage.clear();
      this.setUserAvatar(null);
      this.$router.push("/login");
    }
  }
};
</script>

<style >
.anticon {
  display: inline-block;
  color: inherit;
  font-style: normal;
  line-height: 0;
  text-align: center;
  text-transform: none;
  vertical-align: 0.1em;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>