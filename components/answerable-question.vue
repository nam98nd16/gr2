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
      <a-radio-group class="mb-2 answerable" v-model="answeredKey">
        <a-radio :class="questionKey == 1 ? 'correct-answer' : ''" :value="1">
          A. 0
        </a-radio>
        <a-radio :class="questionKey == 2 ? 'correct-answer' : ''" :value="2">
          B. 10
        </a-radio>
        <a-radio :class="questionKey == 3 ? 'correct-answer' : ''" :value="3">
          C. 5
        </a-radio>
        <a-radio :class="questionKey == 4 ? 'correct-answer' : ''" :value="4">
          D. 2
        </a-radio></a-radio-group
      >
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
  props: ["questionNumber", "questionKey"],
  data() {
    return {
      answeredKey: "",
      modalVisible: false,
      countDown: 30,
    };
  },
  mounted() {},
  methods: {
    handleReport() {
      this.modalVisible = true;
    },
    handleOk() {
      this.modalVisible = false;
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
}
</style>