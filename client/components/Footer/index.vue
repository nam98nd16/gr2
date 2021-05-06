<template>
  <a-layout-footer style="text-align: center">
    <span>Copyright © {{ new Date().getFullYear() }}</span>
    <a-divider type="vertical" />
    <span>GR3</span>
    <a-divider type="vertical" />
    <span>Nguyễn Văn Nam</span>
    <a-divider type="vertical" />
    <span>Supervisor: Assoc. Prof. Nguyễn Bình Minh, PhD</span>
  </a-layout-footer>
</template>

<script>
export default {
  name: "Footer"
};
</script>