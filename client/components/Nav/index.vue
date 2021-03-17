<template>
  <div>
    <a-menu v-model="current" mode="horizontal">
      <a-menu-item key="home">
        <nuxt-link :to="'/'"> <a-icon type="home" />Home </nuxt-link>
      </a-menu-item>
      <a-menu-item key="test">
        <nuxt-link :to="'/test'"> <a-icon type="edit" />Test </nuxt-link>
      </a-menu-item>
      <a-menu-item key="manage-question">
        <nuxt-link :to="'/manage-question'">
          <a-icon type="question-circle" />Question Management
        </nuxt-link>
      </a-menu-item>
      <a-menu-item key="performance">
        <nuxt-link :to="'/performance'">
          <a-icon type="line-chart" />Performance
        </nuxt-link>
      </a-menu-item>
      <a-menu-item v-if="isAdmin" key="manage-users">
        <nuxt-link :to="'/manage-user'">
          <a-icon type="usergroup-add" />User Management
        </nuxt-link>
      </a-menu-item>
      <a-menu-item key="profile">
        <nuxt-link :to="'/profile'">
          <a-icon type="user" />
          {{ getProfileName }}
        </nuxt-link>
      </a-menu-item>
      <a-menu-item @click="handleLogout" key="logout">
        <a-icon type="logout" />Log out
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
export default {
  data() {
    return {
      current: ["home"],
      currentUser: jwt_decode(localStorage.getItem("token"))
    };
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