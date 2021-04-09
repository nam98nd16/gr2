<template>
  <span>
    <a-button
      v-if="!person.hasRequested && !person.hasBeenRequested"
      type="primary"
      style="float: right"
      @click="e => handleAddFriend(e)"
      ><i class="fas fa-user-plus mr-2"></i>Add Friend</a-button
    >
    <span
      style="float: right"
      v-else-if="person.hasRequested && person.hasRequested.confirmed == '0'"
      ><a-button
        type="primary"
        class="mr-2"
        @click="e => handleConfirmFriend(e)"
        ><i class="fas fa-user-check mr-2"></i>Confirm</a-button
      ><a-button type="danger" @click="e => handleConfirmFriend(e)"
        ><i class="fas fa-user-slash mr-2"></i>Delete</a-button
      ></span
    >
    <a-button
      v-else-if="
        person.hasBeenRequested && person.hasBeenRequested.confirmed == '0'
      "
      style="float: right"
      type="danger"
      ghost
      @click="e => handleDeleteFriend(e)"
      ><i class="fas fa-user-times mr-2"></i>Cancel Request</a-button
    >
    <a-popover v-else trigger="click" placement="right">
      <a-button
        slot="content"
        ghost
        type="danger"
        @click="e => handleUnfriend(e)"
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
  </span>
</template>

<script>
import { mapActions } from "vuex";
export default {
  props: ["person"],
  methods: {
    ...mapActions({
      addFriend: "friends/addFriend",
      deleteFriend: "friends/deleteFriend",
      confirmFriend: "friends/confirmFriend"
    }),
    async handleAddFriend(e) {
      e.stopPropagation();
      await this.addFriend({ userId: this.person.userId });
      this.$emit("addedFriend");
    },
    async handleConfirmFriend(e) {
      e.stopPropagation();
      await this.confirmFriend({ userId: this.person.userId });
      this.$emit("confirmedFriend");
    },
    async handleDeleteFriend(e) {
      e.stopPropagation();
      await this.deleteFriend(this.person.userId);
      this.$emit("deletedFriend");
    },
    handleUnfriend(e) {
      this.$confirm({
        title: `Are you sure you want to remove ${this.person.username} ${
          this.person.fullName ? "(" + this.person.fullName + ")" : ""
        } as your friend?`,
        okText: "OK",
        cancelText: "Cancel",
        onOk: async () => {
          await this.handleDeleteFriend(e);
        },
        onCancel() {}
      });
    }
  }
};
</script>