<template>
  <div v-if="profile">
    <a-form class="profile-form">
      <a-form-item :colon="false" v-bind="formItemLayout">
        <span style="display: none" slot="label" class="profile-label"
          >Avatar</span
        >
        <div style="text-align: center; float: left">
          <avatar
            :userId="userId"
            :username="profile.username"
            nullAvatarFontsize="48px"
            nullAvatarFontweight="500"
            diameter="168px"
            lineHeight="168px"
          />
          <div class="username-profile">
            {{ profile.username }}
          </div>
        </div>
      </a-form-item>
      <a-form-item v-bind="formItemLayout">
        <span slot="label" class="profile-label"
          ><i class="fas fa-id-card mr-1"></i>Full name</span
        >
        <span class="profile-text">{{
          profile.fullName ? profile.fullName : "No full name to show"
        }}</span>
      </a-form-item>

      <a-form-item v-bind="formItemLayout">
        <span slot="label" class="profile-label"
          ><i class="fas fa-envelope mr-1"></i>Email</span
        >
        <span class="profile-text">{{
          profile.email ? profile.email : "No email to show"
        }}</span>
      </a-form-item>

      <a-form-item v-bind="formItemLayout">
        <span slot="label" class="profile-label"
          ><i class="fas fa-mobile-alt mr-1"></i>Phone number</span
        >
        <span class="profile-text">{{
          profile.phoneNumber ? profile.phoneNumber : "No phone number to show"
        }}</span>
      </a-form-item>

      <a-form-item v-bind="formItemLayout">
        <span slot="label" class="profile-label"
          ><i class="fas fa-birthday-cake mr-1"></i>Birthday</span
        >
        <span class="profile-text">{{
          profile.birthday
            ? $moment(profile.birthday)
                .add(7, "hours")
                .format("YYYY/MM/DD")
            : "No birthday to show"
        }}</span>
      </a-form-item>

      <a-form-item v-bind="formItemLayout">
        <span slot="label" class="profile-label"
          ><i class="fas fa-house-user mr-1"></i>Address</span
        >
        <span class="profile-text">{{
          profile.address ? profile.address : "No address to show"
        }}</span>
      </a-form-item>

      <a-form-item v-bind="formItemLayout">
        <span slot="label" class="profile-label"
          ><i class="fas fa-venus-mars mr-1"></i>Gender</span
        >
        <span class="profile-text">{{
          profile.gender ? profileGenderText : "No gender to show"
        }}</span>
      </a-form-item>

      <a-form-item v-bind="formItemLayout">
        <span slot="label" class="profile-label"
          ><i class="fas fa-book-reader mr-1"></i>Bio</span
        >
        <span class="profile-text">{{
          profile.autobiography ? profile.autobiography : "No bio to show"
        }}</span>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import avatar from "./avatar.vue";
export default {
  components: { avatar },
  props: ["userId"],
  data() {
    return {
      formItemLayout: {
        labelCol: {
          md: 10,
          sm: 24
        },
        wrapperCol: {
          md: 6,
          sm: 24
        }
      },
      profile: null
    };
  },
  watch: {
    userId(newVal) {
      this.fetchProfile();
    }
  },
  async mounted() {
    this.fetchProfile();
  },
  computed: {
    ...mapState({}),
    profileGenderText() {
      return this.profile.gender == 1
        ? "Male"
        : this.profile.gender == 2
        ? "Female"
        : "Other";
    }
  },
  methods: {
    ...mapActions({
      getProfile: "getProfile"
    }),
    async fetchProfile() {
      this.profile = await this.getProfile(this.userId);
      console.log("p", this.profile);
    }
  }
};
</script>