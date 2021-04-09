<template>
  <span>
    <div v-if="avatarURL" class="profile-img-container">
      <img :src="avatarURL" :class="'ghx-avatar-img'" :style="avatarStyle" />
    </div>
    <div v-else class="profile-img-container">
      <span
        :class="'ghx-avatar-img null-avatar'"
        :style="nullAvatarStyle + avatarStyle"
      >
        {{ username.charAt(0) }}
      </span>
    </div>
  </span>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  props: [
    "userId",
    "username",
    "diameter",
    "nullAvatarFontsize",
    "nullAvatarFontweight",
    "lineHeight",
    "isMyAvatar"
  ],
  data() {
    return {
      avatarURL: null
    };
  },
  async mounted() {
    this.avatarURL = await this.getAvatar(this.userId);
  },
  watch: {
    avatar(newVal) {
      if (this.isMyAvatar) this.avatarURL = newVal;
    },
    async userId(newVal) {
      this.avatarURL = await this.getAvatar(this.userId);
    }
  },
  computed: {
    ...mapState({
      avatar: state => state.avatar
    }),
    avatarStyle() {
      return `height: ${this.diameter}; line-height: ${this.lineHeight}; width: ${this.diameter} !important;`;
    },
    nullAvatarStyle() {
      return `font-size: ${this.nullAvatarFontsize}; font-weight: ${this.nullAvatarFontweight};`;
    }
  },
  methods: {
    ...mapActions({
      getAvatar: "getAvatar"
    })
  }
};
</script>

<style scoped>
.ghx-avatar-img {
  -webkit-border-radius: 50%;
  border-radius: 50%;
  font-size: 24px;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  text-align: center;
  text-transform: uppercase;
  vertical-align: middle;
}

.null-avatar {
  background-color: lightblue;
  font: Arial;
  color: white;
}

.profile-img-container {
  position: relative;
  display: inline-block; /* added */
  /* overflow: hidden; added */
}
</style>