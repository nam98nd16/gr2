<template>
  <div class="person-card">
    <a-card class="mt-1" hoverable style="width: 300px">
      <div class="username">
        {{ person.username }}
      </div>

      <div v-if="person.fullName">{{ person.fullName }}</div>
    </a-card>
  </div>
</template>

<script>
import PrivilegeTag from "../components/privilege-tag.vue";
export default {
  props: ["person"],
  components: { PrivilegeTag },
  data() {
    return {};
  },
  mounted() {},
  computed: {},
  watch: {},
  methods: {}
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