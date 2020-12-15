<template>
  <div>
    <page-title title="Test" />
    Select topic
    <br />
    <a-select
      style="min-width: 120px"
      class="mb-2"
      v-model="selectedTopic"
      :options="[
        { value: 'math', label: 'Math' },
        { value: 'english', label: 'English' },
      ]"
    />

    <br />
    <br />

    Select test length
    <br />
    <a-select
      style="min-width: 120px"
      class="mb-2"
      v-model="selectedLength"
      :options="[
        { value: 'short', label: 'Short (10 questions)' },
        { value: 'medium', label: 'Medium (20 questions)' },
        { value: 'long', label: 'Long (30 questions)' },
      ]"
    />

    <br />
    <br />

    Select test difficulty
    <br />
    <a-select
      style="min-width: 120px"
      class="mb-2"
      v-model="selectedDifficulty"
      :options="[
        { value: 'adaptive', label: 'Adaptive' },
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'hard', label: 'Hard' },
      ]"
    />
    <br /><br />
    <a-button type="primary" @click="handleStartingTest"
      ><i class="fas fa-hourglass-start mr-2"></i>Start</a-button
    >
  </div>
</template>

<script>
import pageTitle from "../components/page-title.vue";
export default {
  components: { pageTitle },
  data() {
    return {
      selectedTopic: "math",
      selectedLength: "medium",
      selectedDifficulty: "adaptive",
    };
  },
  methods: {
    handleStartingTest() {
      this.$router.push("/taking-test");
    },
  },
};
</script>