<template>
  <a-card v-if="profile">
    <a-form labelAlign="left" class="profile-form" v-bind="formItemLayout">
      <a-form-item :colon="false">
        <span style="display: none" slot="label" class="profile-label"
          >Avatar</span
        >
        <div style="text-align: center; float: left">
          <avatar
            :userId="user.userId"
            :username="profile.username"
            nullAvatarFontsize="48px"
            nullAvatarFontweight="500"
            diameter="168px"
            lineHeight="168px"
          />
          <div class="username-profile">
            {{ profile.username }}
          </div>
          <privilege-tag :role="user.role" :subjectId="user.subjectId" />
        </div>
        <friend-actions
          :person="user"
          @addedFriend="$emit('addedFriend')"
          @confirmedFriend="$emit('confirmedFriend')"
          @deletedFriend="$emit('deletedFriend')"
        />
      </a-form-item>

      <form-text icon="id-card" label="Full name" :value="profile.fullName" />
      <form-text icon="envelope" label="Email" :value="profile.email" />
      <form-text
        icon="mobile-alt"
        label="Phone number"
        :value="profile.phoneNumber"
      />
      <form-text
        icon="birthday-cake"
        label="Birthday"
        :value="
          profile.birthday
            ? $moment(profile.birthday)
                .add(7, 'hours')
                .format('YYYY/MM/DD')
            : null
        "
      />
      <form-text icon="house-user" label="Address" :value="profile.address" />
      <form-text icon="venus-mars" label="Gender" :value="profile.gender" />
      <form-text
        icon="book-reader"
        label="Bio"
        :value="profile.autobiography"
      />
    </a-form>
  </a-card>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import avatar from "./avatar.vue";
import FormText from "./form-text.vue";
import FriendActions from "./friend-actions.vue";
import PrivilegeTag from "./privilege-tag.vue";
export default {
  components: { avatar, FormText, FriendActions, PrivilegeTag },
  props: ["user"],
  data() {
    return {
      formItemLayout: {
        labelCol: {
          md: { span: 4, offset: 6 },
          sm: 24
        },
        wrapperCol: {
          md: 14,
          sm: 24
        }
      },
      profile: null
    };
  },
  watch: {
    user(newVal) {
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
      this.profile = await this.getProfile(this.user.userId);
    }
  }
};
</script>

<style scoped>
.ant-card-bordered {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
}
</style>