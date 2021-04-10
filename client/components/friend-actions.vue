<template>
  <span>
    <a-button
      v-if="
        !person.hasRequested &&
          !person.hasBeenRequested &&
          person.userId != currentUser.userId
      "
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
    <a-popover
      v-model="popoverIsVisible"
      v-else-if="person.hasBeenRequested || person.hasRequested"
      trigger="click"
      placement="right"
    >
      <div slot="content">
        <a-button ghost type="danger" @click="e => handleUnfriend(e)"
          ><i class="fas fa-user-times mr-2"></i>Unfriend</a-button
        ><br />
        <a-button
          v-if="!isViewingPerformance && !shouldNotRenderDetailActions"
          class="mt-2"
          type="primary"
          @click="e => handleViewPerformance(e)"
          ><i class="fas fa-chart-line mr-2"></i>View performance</a-button
        >
        <a-button
          v-else-if="!shouldNotRenderDetailActions"
          class="mt-2"
          type="primary"
          @click="e => handleViewProfile(e)"
          ><i class="fas fa-address-card mr-2"></i>View profile</a-button
        >
      </div>

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
import jwt_decode from "jwt-decode";
import { mapActions } from "vuex";
export default {
  props: ["person", "isViewingPerformance", "shouldNotRenderDetailActions"],
  data() {
    return {
      popoverIsVisible: false,
      currentUser: jwt_decode(localStorage.getItem("token"))
    };
  },
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
          this.popoverIsVisible = false;
          await this.handleDeleteFriend(e);
        },
        onCancel() {}
      });
    },
    handleViewPerformance() {
      this.popoverIsVisible = false;
      this.$emit("viewPerformance");
    },
    handleViewProfile() {
      this.popoverIsVisible = false;
      this.$emit("viewProfile");
    }
  }
};
</script>