<template>
  <a-form-item>
    <span slot="label" class="profile-label"
      ><i :class="`fas fa-${icon} mr-1`"></i>{{ label }}</span
    >
    <span class="profile-text">{{
      value
        ? value
        : `No ${label.charAt(0).toLowerCase() + label.slice(1)} to show`
    }}</span>
  </a-form-item>
</template>

<script>
export default {
  props: ["label", "value", "icon"]
};
</script>