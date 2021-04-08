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
      <a-menu-item v-if="isAdmin" key="manage-subject">
        <nuxt-link :to="'/manage-subject'">
          <i class="fas fa-book-open mr-2"></i>Subject Management
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
      <a-menu-item key="profile">
        <nuxt-link :to="'/profile'">
          <i class="fas fa-user mr-2"></i>{{ getProfileName }}
        </nuxt-link>
      </a-menu-item>
      <a-menu-item @click="handleLogout" key="logout">
        <i class="fas fa-sign-out-alt mr-2"></i>Log out
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
export default {
  data() {
    return {
      current: null,
      currentUser: jwt_decode(localStorage.getItem("token"))
    };
  },
  mounted() {
    let curRoute = this.$route.name;
    this.current = [curRoute];
  },
  methods: {
    handleLogout() {
      localStorage.clear();
      this.$router.push("/login");
    }
  },
  computed: {
    getProfileName() {
      return this.currentUser.username;
    },
    isAdmin() {
      return this.currentUser.role == 0;
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