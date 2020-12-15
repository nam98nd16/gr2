<template>
  <div>
    <a-card size="small">
      <div slot="title">
        {{ questionNumber }}. Simplify :150 ÷ (6 + 3 x 8) - 5 ?
        <a-tag color="green">Math</a-tag>
      </div>
      <div slot="extra">
        <a-button size="small" type="primary" ghost @click="handleReport"
          >Report</a-button
        >
      </div>
      <a-radio-group
        class="mb-2 answerable"
        :value="
          isReviewing && answer
            ? answer.answeredKey
            : isReviewing && !answer
            ? ''
            : answeredKey
        "
        @change="(e) => handleAnswer(e)"
      >
        <a-radio :class="correctAnswerIsA ? 'correct-answer' : ''" :value="1">
          A. 0 <i v-if="correctAnswerIsA" class="fas fa-check mr-2" />
        </a-radio>
        <a-radio :class="correctAnswerIsB ? 'correct-answer' : ''" :value="2">
          B. 10 <i v-if="correctAnswerIsB" class="fas fa-check mr-2" />
        </a-radio>
        <a-radio :class="correctAnswerIsC ? 'correct-answer' : ''" :value="3">
          C. 5 <i v-if="correctAnswerIsC" class="fas fa-check mr-2" />
        </a-radio>
        <a-radio :class="correctAnswerIsD ? 'correct-answer' : ''" :value="4">
          D. 2 <i v-if="correctAnswerIsD" class="fas fa-check mr-2" /> </a-radio
      ></a-radio-group>
    </a-card>

    <a-modal
      v-model="modalVisible"
      centered
      title="Report question"
      @ok="handleOk"
    >
      <a-textarea placeholder="Enter the reason to report this question ..." />
    </a-modal>
  </div>
</template>

<script>
export default {
  props: ["questionNumber", "answerKey", "isReviewing", "answer"],
  data() {
    return {
      answeredKey: "",
      modalVisible: false,
    };
  },
  mounted() {},
  computed: {
    correctAnswerIsA() {
      return this.isReviewing && this.answerKey[this.questionNumber - 1] == 1;
    },
    correctAnswerIsB() {
      return this.isReviewing && this.answerKey[this.questionNumber - 1] == 2;
    },
    correctAnswerIsC() {
      return this.isReviewing && this.answerKey[this.questionNumber - 1] == 3;
    },
    correctAnswerIsD() {
      return this.isReviewing && this.answerKey[this.questionNumber - 1] == 4;
    },
  },
  methods: {
    handleReport() {
      this.modalVisible = true;
    },
    handleOk() {
      this.modalVisible = false;
    },
    handleAnswer(e) {
      if (!this.isReviewing) {
        this.answeredKey = e.target.value;
        this.$emit("answer", e.target.value);
      }
    },
  },
};
</script>

<style>
.answerable .ant-radio-wrapper:not(:last-child) {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  font-feature-settings: "tnum", "tnum";
  position: relative;
  display: inline-block;
  margin-right: 8px;
  white-space: nowrap;
  cursor: pointer;
  display: block;
  height: 30px;
}

.correct-answer {
  color: blue !important;
  font-weight: bold;
}
</style>