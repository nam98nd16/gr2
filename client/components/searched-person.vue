<template>
  <div class="person-card">
    <a-card class="mt-1" hoverable>
      <a-row :gutter="4" type="flex" align="top" justify="start">
        <a-col :span="6">
          <avatar
            :userId="person.userId"
            :username="person.username"
            nullAvatarFontsize="32px"
            nullAvatarFontweight="400"
            diameter="70px"
            lineHeight="66px"
          />
        </a-col>
        <a-col :span="18">
          <div class="username">
            {{ person.username }}
          </div>

          <div v-if="person.fullName">{{ person.fullName }}</div>
          <friend-actions
            :person="person"
            @addFriend="handleAddFriend"
            @confirmFriend="handleConfirmFriend"
            @deleteFriend="handleDeleteFriend"
            @unfriend="handleUnfriend"
          />
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import PrivilegeTag from "../components/privilege-tag.vue";
import { mapState, mapActions } from "vuex";
import Avatar from "./avatar.vue";
import FriendActions from "./friend-actions.vue";
export default {
  props: ["person"],
  components: { PrivilegeTag, Avatar, FriendActions },
  data() {
    return {};
  },
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    ...mapActions({
      addFriend: "friends/addFriend",
      deleteFriend: "friends/deleteFriend",
      confirmFriend: "friends/confirmFriend"
    }),
    async handleAddFriend() {
      await this.addFriend({ userId: this.person.userId });
      this.$emit("addedFriend");
    },
    async handleConfirmFriend() {
      await this.confirmFriend({ userId: this.person.userId });
      this.$emit("confirmedFriend");
    },
    async handleDeleteFriend() {
      await this.deleteFriend(this.person.userId);
      this.$emit("deletedFriend");
    },
    handleUnfriend() {
      this.$confirm({
        title: `Are you sure you want to remove ${this.person.username} ${
          this.person.fullName ? "(" + this.person.fullName + ")" : ""
        } as your friend?`,
        okText: "OK",
        cancelText: "Cancel",
        onOk: async () => {
          await this.handleDeleteFriend();
          this.$emit("delete");
        },
        onCancel() {}
      });
    }
  }
};
</script>

<style>
.username {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  font-size: 16px;
  background: transparent;
}

.person-card .ant-card-body {
  padding: 12px;
  zoom: 1;
}

.person-card .ant-card-bordered {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
}
</style>