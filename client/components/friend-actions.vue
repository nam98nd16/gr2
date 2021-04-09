<template>
  <span>
    <a-button
      v-if="!person.hasRequested && !person.hasBeenRequested"
      type="primary"
      style="float: right"
      @click="
        e => {
          e.stopPropagation();
          $emit('addFriend');
        }
      "
      ><i class="fas fa-user-plus mr-2"></i>Add Friend</a-button
    >
    <span
      style="float: right"
      v-else-if="person.hasRequested && person.hasRequested.confirmed == '0'"
      ><a-button
        type="primary"
        class="mr-2"
        @click="
          e => {
            e.stopPropagation();
            $emit('confirmFriend');
          }
        "
        ><i class="fas fa-user-check mr-2"></i>Confirm</a-button
      ><a-button
        type="danger"
        @click="
          e => {
            e.stopPropagation();
            $emit('deleteFriend');
          }
        "
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
      @click="
        e => {
          e.stopPropagation();
          $emit('deleteFriend');
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
            $emit('unfriend');
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
  </span>
</template>

<script>
export default {
  props: ["person"]
};
</script>