<template>
  <div>
    <page-title :title="getCurrentSubjectName() + ' Rated Test'" />
    <div v-if="currentRating" :class="hasSubmitted ? 'mb-4' : ''">
      <i class="fas fa-medal" style="color: blue"></i> Your rating:
      {{ currentRating.toFixed(2) }}
    </div>
    <div
      v-if="!hasSubmitted && countDown != 0"
      class="mb-4"
      style="text-align: center"
    >
      <i class="fas fa-clock"></i> Time left:
      {{ countDown }}
    </div>

    <div v-if="currentQuestion">
      <answerable-question
        :questionNumber="null"
        :isReviewing="hasSubmitted"
        :answer="{ answeredKey: answeredId }"
        :question="currentQuestion"
        ref="question"
        @answer="handleAnswer"
      />
      <div class="mt-2">
        <div style="float: right">
          <a-button type="primary" :disabled="!hasSubmitted" @click="handleNext"
            ><i class="fas fa-arrow-right mr-2"></i>Next</a-button
          >
          <a-button
            :disabled="hasSubmitted"
            type="primary"
            ghost
            @click="performSubmission"
            >Submit</a-button
          >
        </div>
      </div>
    </div>
    <div v-else-if="errorMsg" style="text-align: center">{{ errorMsg }}</div>
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
      countDown: 0,
      hasSubmitted: false,
      currentQuestion: null,
      answeredId: null,
      errorMsg: ""
    };
  },
  async created() {
    if (!this.$route.params?.subjectId) {
      this.$router.push("/test");
    } else {
      this.getRating({
        subjectId: this.$route.params.subjectId
      });
      this.fetchNewQuestion();
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
      getRating: "test/getRating",
      submitRatedAnswer: "test/submitRatedAnswer"
    }),
    getCurrentSubjectName() {
      return this.allSubjects.find(
        s => s.subjectId == this.$route.params.subjectId
      )?.subjectName;
    },
    async fetchNewQuestion() {
      try {
        this.currentQuestion = await this.getRatedQuestion({
          subjectId: this.$route.params.subjectId
        });
        this.countDown = this.currentQuestion.timeAllowed;
        this.startCountDownTimer();
        this.hasSubmitted = false;
        this.answeredId = null;
        errorMsg = "";
      } catch (error) {
        this.errorMsg = error.response.data;
      }
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
    async performSubmission() {
      this.countDown = 0;
      this.hasSubmitted = true;
      let payload = {
        answeredId: this.answeredId,
        questionId: this.currentQuestion.questionId
      };
      let correctAnsId = await this.submitRatedAnswer(payload);
      this.currentQuestion.answerId = correctAnsId;
      this.getRating({
        subjectId: this.$route.params.subjectId
      });
    },
    async handleNext() {
      await this.fetchNewQuestion();
    },
    handleAnswer(answeredKey) {
      this.answeredId = answeredKey;
    }
  },
  async beforeRouteLeave(to, from, next) {
    if (!this.hasSubmitted && !this.errorMsg) await this.performSubmission();
    next();
  }
};
</script>