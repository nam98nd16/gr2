<template>
  <a-layout style="min-height: 100vh">
    <nuxt />
    <Footer />
  </a-layout>
</template>
<script>
import Footer from "@/components/Footer";
export default {
  components: { Footer },
  middleware: "loginGuard",
};
</script>