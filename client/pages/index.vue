<template>
  <div class="">
    <div>
      <a-carousel arrows :after-change="onChange">
        <div
          slot="prevArrow"
          slot-scope="props"
          class="custom-slick-arrow"
          style="left: 20px;zIndex: 1"
        >
          <a-icon type="left-circle" />
        </div>
        <div
          slot="nextArrow"
          slot-scope="props"
          class="custom-slick-arrow"
          style="right: 20px"
        >
          <a-icon type="right-circle" />
        </div>
        <div class="img-container">
          <h3>IMPROVE YOUR SKILLS WITH TRAINING</h3>
          <nuxt-link :to="'/test'">
            <img
              src="../static/TRAINING.png"
              @click="handleClickLink('test')"
            />
          </nuxt-link>
        </div>
        <div class="img-container">
          <h3>CREATE YOUR OWN QUESTION</h3>
          <nuxt-link :to="'/manage-question'"
            ><img
              src="../static/QUESTION.png"
              @click="handleClickLink('manage-question')"
          /></nuxt-link>
        </div>
        <div class="img-container">
          <h3>REVIEW YOUR PERFORMANCE</h3>
          <nuxt-link :to="'/performance'"
            ><img
              src="../static/PERFORMANCE.png"
              @click="handleClickLink('performance')"
          /></nuxt-link>
        </div>
        <div class="img-container">
          <h3>VIEW LEADERBOARD</h3>
          <nuxt-link :to="'/leaderboard'"
            ><img
              src="../static/LEADERBOARD.png"
              @click="handleClickLink('leaderboard')"
          /></nuxt-link>
        </div>
        <div class="img-container">
          <h3>MAKE FRIENDS</h3>
          <nuxt-link :to="'/friends'"
            ><img
              src="../static/FRIENDS.png"
              @click="handleClickLink('friends')"
          /></nuxt-link>
        </div>
      </a-carousel>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  async mounted() {},
  methods: {
    ...mapMutations({
      setCurrentRoute: "setCurrentRoute"
    }),
    onChange() {},
    handleClickLink(link) {
      this.setCurrentRoute(link);
    }
  }
};
</script>

<style>
.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 500;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>

<style scoped>
.ant-carousel >>> .slick-slide {
  text-align: center;
  line-height: 160px;
  background: #364d79;
  overflow: auto;
}

.ant-carousel >>> .slick-slide h3 {
  color: #fff;
}

.img-container img {
  display: block;
  margin: auto;
  max-height: calc(100vh - 335px);
  max-width: 90%;
  margin-bottom: 100px;
}

.ant-carousel >>> .custom-slick-arrow {
  width: 50px;
  height: 50px;
  font-size: 50px;
  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  opacity: 0.3;
}
.ant-carousel >>> .custom-slick-arrow:before {
  display: none;
}
.ant-carousel >>> .custom-slick-arrow:hover {
  opacity: 0.5;
}
</style>
