<template>
  <div v-if="startTime && testQuestions.length">
    <page-title :title="getCurrentSubjectName() + ' Practice'" />
    <div v-if="!isReviewing" class="mb-4" style="text-align: center">
      <i class="fas fa-clock"></i> Time left for the current question:
      {{ countDown }}
      <div>
        Questions unanswered: {{ testQuestions.length - answers.length }}
      </div>
    </div>
    <div v-else class="mb-4" style="text-align: center">
      Your score: {{ numberOfCorrectAnswers }}/{{ testQuestions.length }}
    </div>

    <answerable-question
      :questionNumber="currentQuestionNo"
      :isReviewing="isReviewing"
      :answer="answers.find(ans => ans.questionNumber == currentQuestionNo)"
      :question="testQuestions[currentQuestionNo - 1]"
      ref="question"
      @answer="handleAnswer"
    />
    <div class="mt-2">
      <a-button v-if="!isReviewing" type="danger" @click="handleAbandon"
        >Abandon</a-button
      >
      <div style="float: right">
        <a-button
          v-if="isReviewing"
          :disabled="currentQuestionNo == 1"
          type="primary"
          @click="handleBack"
          ><i class="fas fa-arrow-left mr-2"></i>Back</a-button
        >
        <a-button
          :disabled="currentQuestionNo == testQuestions.length"
          type="primary"
          @click="handleNext"
          ><i class="fas fa-arrow-right mr-2"></i>Next</a-button
        >
        <a-button v-if="!isReviewing" type="primary" ghost @click="handleSubmit"
          >Submit</a-button
        >
      </div>
    </div>

    <a-modal
      :cancelText="'Review'"
      :cancelButtonProps="{ props: {}, on: { click: handleReview } }"
      :maskClosable="false"
      v-model="modalVisible"
      :closable="false"
      centered
      title="Your score"
      @ok="handleOk"
    >
      <div class="score-text">
        {{ numberOfCorrectAnswers }}/{{ testQuestions.length }}
      </div>
    </a-modal>
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
      modalVisible: false,
      isReviewing: false,
      currentQuestionNo: 1,
      answers: [],
      hasSubmitted: false,
      startTime: null,
      completeTime: null
    };
  },
  created() {
    if (!this.$route.params?.difficultyLevel) {
      this.$router.push("/test");
    } else {
      this.startTime = this.$moment();
      this.countDown = this.testQuestions[0].timeAllowed;
      this.startCountDownTimer();
    }
  },
  mounted() {},
  computed: {
    ...mapState({
      testQuestions: state => state.test.testQuestions,
      allSubjects: state => state.subjects.allSubjects
    }),
    numberOfCorrectAnswers() {
      let correctAnswers = 0;
      if (this.answers.length)
        this.answers.forEach((ans, index) => {
          if (
            this.testQuestions.findIndex(
              question => question.answerId == ans.answeredKey
            ) >= 0
          )
            correctAnswers++;
        });
      return correctAnswers;
    }
  },
  methods: {
    ...mapActions({
      submitAnswers: "test/submitAnswers"
    }),
    ...mapMutations({
      setTestQuestions: "test/setTestQuestions"
    }),
    handleAbandon() {
      this.$confirm({
        title:
          "Are you sure to abandon the test? Your attempt will not be recorded!",
        okText: "OK",
        cancelText: "Cancel",
        onOk: () => {
          window.history.back();
        },
        onCancel() {}
      });
    },
    handleNext() {
      if (this.currentQuestionNo < this.testQuestions.length)
        this.currentQuestionNo++;
      if (!this.countDown) {
        this.countDown = this.testQuestions[
          this.currentQuestionNo - 1
        ].timeAllowed;
        this.startCountDownTimer();
      } else
        this.countDown = this.testQuestions[
          this.currentQuestionNo - 1
        ].timeAllowed;
      this.$refs.question.answeredKey = "";
    },
    handleBack() {
      if (this.currentQuestionNo > 1) this.currentQuestionNo--;
    },
    handleSubmit() {
      this.$confirm({
        title:
          "Are you sure to submit your answers? This action cannot be undone!",
        okText: "OK",
        cancelText: "Cancel",
        onOk: async () => {
          await this.performSubmission();
        },
        onCancel() {}
      });
    },
    async performSubmission() {
      this.completeTime = this.$moment();
      let payload = {
        difficultyLevel: this.$route.params.difficultyLevel,
        subjectId: this.$route.params.subjectId,
        startTime: this.startTime,
        totalTimeSpent: this.completeTime.diff(this.startTime),
        answers: this.answers,
        questionIds: this.testQuestions.map(question => question.questionId)
      };
      await this.submitAnswers(payload);
      this.modalVisible = true;
      this.hasSubmitted = true;
    },
    getCurrentSubjectName() {
      return this.allSubjects.find(
        s => s.subjectId == this.$route.params.subjectId
      )?.subjectName;
    },
    handleOk() {
      this.modalVisible = false;
      window.history.back();
    },
    handleReview() {
      this.modalVisible = false;
      this.isReviewing = true;
      this.answerKey = 1;
    },
    handleAnswer(answeredKey) {
      let currentQuestionIndex = this.answers.findIndex(
        ans => ans.questionNumber == this.currentQuestionNo
      );
      if (currentQuestionIndex == -1)
        this.answers.push({
          questionNumber: this.currentQuestionNo,
          questionId: this.testQuestions[this.currentQuestionNo - 1].questionId,
          answeredKey: answeredKey
        });
      else this.answers[currentQuestionIndex].answeredKey = answeredKey;
    },
    async startCountDownTimer() {
      if (this.hasSubmitted) return;
      if (this.countDown > 0) {
        setTimeout(() => {
          this.countDown -= 1;
          this.startCountDownTimer();
        }, 1000);
      } else if (this.currentQuestionNo < this.testQuestions.length)
        this.handleNext();
      else {
        await this.performSubmission();
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    this.hasSubmitted = true;
    this.setTestQuestions([]);
    next();
  }
};
</script>

<style>
.score-text {
  text-align: center;
  font-size: x-large;
  font-weight: bolder;
  color: blue;
}
</style>