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
          <a-button
            v-if="!person.hasRequested && !person.hasBeenRequested"
            type="primary"
            style="float: right"
            @click="
              e => {
                e.stopPropagation();
                handleAddFriend();
              }
            "
            ><i class="fas fa-user-plus mr-2"></i>Add Friend</a-button
          >
          <span
            style="float: right"
            v-else-if="
              person.hasRequested && person.hasRequested.confirmed == '0'
            "
            ><a-button
              type="primary"
              class="mr-2"
              @click="
                e => {
                  e.stopPropagation();
                  handleConfirmFriend();
                }
              "
              ><i class="fas fa-user-check mr-2"></i>Confirm</a-button
            ><a-button
              type="danger"
              @click="
                e => {
                  e.stopPropagation();
                  handleDeleteFriend();
                }
              "
              ><i class="fas fa-user-slash mr-2"></i>Delete</a-button
            ></span
          >
          <a-button
            v-else-if="
              person.hasBeenRequested &&
                person.hasBeenRequested.confirmed == '0'
            "
            style="float: right"
            type="danger"
            ghost
            @click="
              e => {
                e.stopPropagation();
                handleDeleteFriend();
              }
            "
            ><i class="fas fa-user-times mr-2"></i>Cancel Request</a-button
          >
          <a-popover v-else trigger="click" placement="right">
            <a-button
              slot="content"
              ghost
              type="danger"
              @click="
                e => {
                  e.stopPropagation();
                  handleUnfriend();
                }
              "
              ><i class="fas fa-user-times mr-2"></i>Unfriend</a-button
            >
            <a-button
              @click="e => e.stopPropagation()"
              style="float: right"
              ghost
              type="primary"
              ><i class="fas fa-user-check mr-2"></i>Friends</a-button
            >
          </a-popover>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import PrivilegeTag from "../components/privilege-tag.vue";
import { mapState, mapActions } from "vuex";
import Avatar from "./avatar.vue";
export default {
  props: ["person"],
  components: { PrivilegeTag, Avatar },
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