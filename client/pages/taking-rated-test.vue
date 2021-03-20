<template>
  <div v-if="currentQuestion">
    <page-title :title="getCurrentSubjectName() + ' Rated Test'" />
    <div v-if="currentRating" :class="hasSubmitted ? 'mb-4' : ''">
      <i class="fas fa-medal"></i> Your rating:
      {{ currentRating.toFixed(2) }}
    </div>
    <div v-if="!hasSubmitted" class="mb-4" style="text-align: center">
      <i class="fas fa-clock"></i> Time left:
      {{ countDown }}
    </div>

    <answerable-question
      :questionNumber="null"
      :isReviewing="hasSubmitted"
      :answer="null"
      :question="currentQuestion"
      ref="question"
      @answer="handleAnswer"
    />
    <div class="mt-2">
      <div style="float: right">
        <a-button type="primary" @click="handleNext"
          ><i class="fas fa-arrow-right mr-2"></i>Next</a-button
        >
        <a-button
          :disabled="hasSubmitted"
          type="primary"
          ghost
          @click="handleSubmit"
          >Submit</a-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import AnswerableQuestion from "../components/answerable-question.vue";
import PageTitle from "../components/page-title.vue";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  components: { AnswerableQuestion, PageTitle },
  data() {
    return {
      countDown: 30,
      hasSubmitted: false,
      currentQuestion: null
    };
  },
  async created() {
    if (!this.$route.params?.subjectId) {
      this.$router.push("/test");
    } else {
      this.getRating({
        subjectId: this.$route.params.subjectId
      });
      this.currentQuestion = await this.getRatedQuestion({
        subjectId: this.$route.params.subjectId
      });
      this.countDown = this.currentQuestion.timeAllowed;
      this.startCountDownTimer();
    }
  },
  computed: {
    ...mapState({
      allSubjects: state => state.subjects.allSubjects,
      currentRating: state => state.test.currentRating
    })
  },
  methods: {
    ...mapActions({
      getRatedQuestion: "test/getRatedQuestion",
      getRating: "test/getRating"
    }),
    getCurrentSubjectName() {
      return this.allSubjects.find(
        s => s.subjectId == this.$route.params.subjectId
      )?.subjectName;
    },
    async startCountDownTimer() {
      if (this.countDown > 0) {
        setTimeout(() => {
          this.countDown -= 1;
          this.startCountDownTimer();
        }, 1000);
      } else if (!this.hasSubmitted) {
        this.performSubmission();
      }
    },
    performSubmission() {
      this.hasSubmitted = true;
    },
    handleNext() {},
    handleSubmit() {},
    handleAnswer() {}
  }
};
</script>