<template>
  <div>
    <page-title title="Test" />
    Select topic
    <br />
    <a-select
      style="min-width: 150px"
      class="mb-2"
      v-model="selectedTopic"
      :options="subjects"
    />

    <br />
    <br />

    Select mode
    <br />
    <a-radio-group :class="'mb-2'" v-model="selectedMode" button-style="solid">
      <a-radio-button value="practice">
        Practice
      </a-radio-button>
      <a-radio-button value="rated">
        Rated
      </a-radio-button>
    </a-radio-group>

    <br />
    <br />

    <div v-if="selectedMode == 'practice'">
      Select test length
      <br />
      <a-select
        style="min-width: 120px"
        class="mb-2"
        v-model="selectedLength"
        :options="[
          { value: 10, label: 'Short (10 questions)' },
          { value: 20, label: 'Medium (20 questions)' },
          { value: 30, label: 'Long (30 questions)' }
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
          { value: 'easy', label: 'Easy' },
          { value: 'medium', label: 'Medium' },
          { value: 'hard', label: 'Hard' }
        ]"
      />
      <br /><br />
    </div>
    <a-button type="primary" @click="handleStartingTest"
      ><i class="fas fa-hourglass-start mr-2"></i>Start</a-button
    >
  </div>
</template>

<script>
import pageTitle from "../components/page-title.vue";
import { mapState, mapActions } from "vuex";
export default {
  components: { pageTitle },
  data() {
    return {
      selectedTopic: 1,
      selectedLength: 20,
      selectedDifficulty: "medium",
      subjects: [],
      selectedMode: "practice"
    };
  },
  async mounted() {
    this.allSubjects.length ? undefined : await this.getAllSubjects();
    this.subjects = this.allSubjects.map(subject => ({
      value: subject.subjectId,
      label: subject.subjectName
    }));
  },
  computed: {
    ...mapState({
      allSubjects: state => state.subjects.allSubjects
    })
  },
  methods: {
    ...mapActions({
      getAllSubjects: "subjects/getAllSubjects",
      getTestQuestions: "test/getTestQuestions"
    }),
    async handleStartingTest() {
      let payload = {
        subjectId: this.selectedTopic,
        length: this.selectedLength,
        difficulty: this.selectedDifficulty
      };
      try {
        if (this.selectedMode == "practice") {
          await this.getTestQuestions(payload);
          this.$router.push({
            name: "taking-test",
            params: {
              difficultyLevel: this.selectedDifficulty,
              subjectId: this.selectedTopic
            }
          });
        } else
          this.$router.push({
            name: "taking-rated-test",
            params: {
              subjectId: this.selectedTopic
            }
          });
      } catch (error) {
        this.$notification.error({ message: error.response.data });
      }
    }
  }
};
</script>