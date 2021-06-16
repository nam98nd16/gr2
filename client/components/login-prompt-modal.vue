<template>
  <a-modal
    title="Please login to continue!"
    centered
    v-model="modalVisible"
    @ok="handleOk"
    :okText="'Login'"
  >
    <div>Some features of the system require users to login to use.</div>
  </a-modal>
</template>

<script>
export default {
  data() {
    return {
      modalVisible: false
    };
  },
  methods: {
    handleOk() {
      this.$router.push("/login");
    }
  }
};
</script>

<style>
</style>