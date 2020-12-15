<template>
  <div>
    <page-title title="Test" />
    <div v-if="!isReviewing" class="mb-4" style="text-align: center">
      <i class="fas fa-clock"></i> Time left for the current question:
      {{ countDown }}
      <div>Questions left: {{ maxQuestionNo - answers.length }}</div>
    </div>
    <div v-else class="mb-4" style="text-align: center">
      Your score: {{ numberOfCorrectAnswers }}/{{ maxQuestionNo }}
    </div>

    <answerable-question
      :questionNumber="currentQuestionNo"
      :answerKey="answerKeys"
      :isReviewing="isReviewing"
      :answer="answers.find((ans) => ans.questionNumber == currentQuestionNo)"
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
          :disabled="currentQuestionNo == maxQuestionNo"
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
      centered
      title="Your score"
      @ok="handleOk"
    >
      <div class="score-text">
        {{ numberOfCorrectAnswers }}/{{ maxQuestionNo }}
      </div>
    </a-modal>
  </div>
</template>

<script>
import AnswerableQuestion from "../components/answerable-question.vue";
import PageTitle from "../components/page-title.vue";
export default {
  components: { AnswerableQuestion, PageTitle },
  data() {
    return {
      countDown: 30,
      modalVisible: false,
      isReviewing: false,
      currentQuestionNo: 1,
      maxQuestionNo: 20,
      answerKeys: [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4],
      answers: [],
    };
  },
  mounted() {
    this.startCountDownTimer();
  },
  computed: {
    numberOfCorrectAnswers() {
      let correctAnswers = 0;
      if (this.answers.length)
        this.answers.forEach((ans, index) => {
          if (ans.answeredKey == this.answerKeys[ans.questionNumber - 1])
            correctAnswers++;
        });
      return correctAnswers;
    },
  },
  methods: {
    handleAbandon() {
      this.$confirm({
        title:
          "Are you sure to abandon the test? Your attempt will not be recorded!",
        okText: "OK",
        cancelText: "Cancel",
        onOk: () => {
          window.history.back();
        },
        onCancel() {},
      });
    },
    handleNext() {
      if (this.currentQuestionNo < this.maxQuestionNo) this.currentQuestionNo++;
      if (!this.countDown) {
        this.countDown = 30;
        this.startCountDownTimer();
      } else this.countDown = 30;
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
        onOk: () => {
          this.modalVisible = true;
        },
        onCancel() {},
      });
    },
    handleOk() {
      this.modalVisible = false;
      window.history.back();
    },
    handleReview() {
      this.modalVisible = false;
      this.isReviewing = true;
      this.answerKey = 1;
      console.log("ans", this.answers);
    },
    handleAnswer(answeredKey) {
      let currentQuestionIndex = this.answers.findIndex(
        (ans) => ans.questionNumber == this.currentQuestionNo
      );
      if (currentQuestionIndex == -1)
        this.answers.push({
          questionNumber: this.currentQuestionNo,
          answeredKey: answeredKey,
        });
      else this.answers[currentQuestionIndex].answeredKey = answeredKey;
    },
    startCountDownTimer() {
      if (this.countDown > 0) {
        setTimeout(() => {
          this.countDown -= 1;
          this.startCountDownTimer();
        }, 1000);
      } else if (this.currentQuestionNo < this.maxQuestionNo) this.handleNext();
      else this.modalVisible = true;
    },
  },
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