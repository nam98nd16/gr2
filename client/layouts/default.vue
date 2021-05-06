<template>
  <a-layout style="margin-right: 10px; margin-left: 10px">
    <Nav class="nav-margin" />
    <nuxt
      class="main-layout"
      style="min-height: calc(100vh - 135px); background: #fff"
    />
    <Footer />
  </a-layout>
</template>

<script>
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
export default {
  middleware: "auth",
  components: { Nav, Footer }
};
</script>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
@media only screen and (min-width: 768px) {
  .main-layout {
    margin: 0px 16px 7px 16px;
    padding: 24px;
  }

  .nav-margin {
    margin-bottom: 10px;
  }
}

@media only screen and (max-width: 767px) {
  .main-layout {
    margin: 0px;
    padding-bottom: 12px;
    padding-top: 12px;
  }
}
</style>
