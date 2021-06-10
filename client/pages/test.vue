<template>
  <a-spin :spinning="loading">
    <page-title title="Training" />
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
    <a-popover placement="right" :overlayClassName="'custom-tooltip'">
      <template slot="content">
        <div>There are 2 training modes:</div>
        <div class="mt-2">
          <span style="font-style: italic">Learning</span>: Practicing questions
          with or without time regulation. No rating points earned or lost.
          Suitable for those seeking to improve their knowledge about a
          particular subject.
        </div>
        <div class="mt-2">
          <span style="font-style: italic">Rated (adaptive)</span>: Answering
          timed questions which are adaptively selected based on your current
          rating of interested subject. Your rating will be changed depending on
          your performance, specifically question difficulty and your current
          rating. Suitable for those seeking to test their true level of
          knowledge about a particular subject.
        </div>
      </template>
      <i class="ml-1 far fa-question-circle"></i>
    </a-popover>
    <br />
    <a-radio-group :class="'mb-2'" v-model="selectedMode" button-style="solid">
      <a-radio-button value="practice">
        Learning
      </a-radio-button>
      <a-radio-button value="rated"> Rated (adaptive) </a-radio-button>
    </a-radio-group>

    <br />
    <br />

    <div v-if="selectedMode == 'practice'">
      Select length
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

      Select difficulty
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
      <a-switch
        class="mb-2"
        checked-children="Timed"
        un-checked-children="Untimed"
        default-unchecked
        v-model="shouldBeTimed"
      />
      <br /><br />
    </div>
    <div v-else class="mb-2">
      {{ getCurrentSubjectName() }} knowledge rating:
      <i class="fas fa-medal" style="color: blue"></i>
      {{ currentRating.toFixed(2) }} <br /><br />
    </div>
    <a-button type="primary" @click="handleStartingTest"
      ><i
        v-if="selectedMode == 'rated' || shouldBeTimed"
        class="fas fa-hourglass-start mr-2"
      ></i
      ><i v-else class="fas fa-bell-slash mr-2"></i>Start</a-button
    >
  </a-spin>
</template>

<script>
import pageTitle from "../components/page-title.vue";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  components: { pageTitle },
  data() {
    return {
      selectedTopic: 1,
      selectedLength: 20,
      selectedDifficulty: "medium",
      subjects: [],
      selectedMode: "practice",
      shouldBeTimed: false,
      loading: false
    };
  },
  async mounted() {
    this.loading = true;
    this.setCurrentRoute("test");
    await Promise.all([
      this.allSubjects.length ? undefined : this.getAllSubjects(),
      this.getRating({ subjectId: this.selectedTopic })
    ]);
    this.loading = false;
    this.subjects = this.allSubjects.map(subject => ({
      value: subject.subjectId,
      label: subject.subjectName
    }));
  },
  computed: {
    ...mapState({
      allSubjects: state => state.subjects.allSubjects,
      currentRating: state => state.test.currentRating
    })
  },
  watch: {
    selectedTopic(newVal) {
      this.getRating({ subjectId: newVal });
    }
  },
  methods: {
    ...mapActions({
      getAllSubjects: "subjects/getAllSubjects",
      getTestQuestions: "test/getTestQuestions",
      getRating: "test/getRating"
    }),
    ...mapMutations({
      setCurrentRoute: "setCurrentRoute"
    }),
    getCurrentSubjectName() {
      return this.allSubjects.find(s => s.subjectId == this.selectedTopic)
        ?.subjectName;
    },
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
              subjectId: this.selectedTopic,
              timed: this.shouldBeTimed
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

<style>
.custom-tooltip {
  max-width: 1000px !important;
}
</style>