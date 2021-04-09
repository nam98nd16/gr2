<template>
  <span>
    <style>
      :root {
        --diameter: {{ diameter }};
        --line-height: {{ lineHeight}};
        --null-avatar-font-size: {{nullAvatarFontsize}};
        --null-avatar-font-weight: {{nullAvatarFontweight}};
      }
    </style>
    <div v-if="avatarURL" class="profile-img-container">
      <img :src="avatarURL" :class="'ghx-avatar-img'" />
    </div>
    <div v-else class="profile-img-container">
      <span :class="'ghx-avatar-img null-avatar'">
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
    }
  },
  computed: {
    ...mapState({
      avatar: state => state.avatar
    })
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
  height: var(--diameter);
  line-height: var(--line-height);
  width: var(--diameter) !important;
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
  font-size: var(--null-avatar-font-size);
  font-weight: var(--null-avatar-font-weight);
  color: white;
}

.profile-img-container {
  position: relative;
  display: inline-block; /* added */
  /* overflow: hidden; added */
}
</style>