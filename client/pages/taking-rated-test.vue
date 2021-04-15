<template>
  <div>
    <page-title :title="getCurrentSubjectName() + ' Rated Test'" />
    <div
      v-if="currentRating !== null && currentRating !== undefined"
      :class="hasSubmitted ? 'mb-4' : ''"
    >
      {{ getCurrentSubjectName() }} knowledge rating:
      <i class="fas fa-medal" style="color: blue"></i>
      {{ currentRating.toFixed(2) }}

      <a-switch
        checked-children="Live rating chart on"
        un-checked-children="Live rating chart off"
        default-unchecked
        v-model="shouldDisplayLiveRatingChart"
      />
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
        :checking="checking"
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
            :disabled="hasSubmitted || checking"
            type="primary"
            ghost
            @click="performSubmission"
            >Submit</a-button
          >
        </div>
      </div>
      <apexchart
        v-show="shouldDisplayLiveRatingChart && ratings.length > 1"
        class="mt-5"
        height="300"
        type="line"
        :options="chartOptions"
        :series="series"
      ></apexchart>
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
      errorMsg: "",
      ratings: [],
      shouldDisplayLiveRatingChart: false,
      checking: false
    };
  },
  async created() {
    if (!this.$route.params?.subjectId) {
      this.$router.push("/test");
    } else {
      this.fetchRating();
      this.fetchNewQuestion();
    }
  },
  computed: {
    ...mapState({
      allSubjects: state => state.subjects.allSubjects,
      currentRating: state => state.test.currentRating
    }),
    chartOptions() {
      let options = {
        chart: {
          height: 300,
          type: "line",
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "straight"
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        xaxis: {
          categories: this.ratings.map(p => p.timestamp),
          labels: {
            show: this.ratings.length > 10 ? false : true
          }
        }
      };

      return options;
    },
    series() {
      return [
        {
          name: this.getCurrentSubjectName() + " rating",
          data: this.ratings.map(p => p.rating.toFixed(2))
        }
      ];
    }
  },
  methods: {
    ...mapActions({
      getRatedQuestion: "test/getRatedQuestion",
      getRating: "test/getRating",
      submitRatedAnswer: "test/submitRatedAnswer"
    }),
    async fetchRating() {
      await this.getRating({
        subjectId: this.$route.params.subjectId
      });
      this.ratings.push({
        rating: this.currentRating,
        timestamp: this.$moment().format("HH:mm:ss")
      });
    },
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
        this.hasSubmitted = false;
        this.startCountDownTimer();
        this.answeredId = null;
        this.errorMsg = "";
      } catch (error) {
        this.errorMsg = error.response.data;
      }
    },
    async startCountDownTimer() {
      if (this.hasSubmitted) return;
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
      this.hasSubmitted = true;
      this.checking = true;
      this.countDown = 0;
      let payload = {
        answeredId: this.answeredId,
        questionId: this.currentQuestion.questionId
      };
      let correctAnsId = await this.submitRatedAnswer(payload);
      this.currentQuestion.answerId = correctAnsId;
      this.checking = false;

      this.fetchRating();
    },
    async handleNext() {
      await this.fetchNewQuestion();
    },
    handleAnswer(answeredKey) {
      this.answeredId = answeredKey;
    }
  },
  async beforeRouteLeave(to, from, next) {
    if (!this.hasSubmitted && !this.errorMsg && this.currentQuestion)
      this.$confirm({
        title:
          "Your answer will be submitted automatically if you leave. Please confirm!",
        okText: "OK",
        cancelText: "Back to the test",
        onOk: async () => {
          await this.performSubmission();
          next();
        },
        onCancel() {}
      });
    else next();
  }
};
</script>