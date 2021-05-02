<template>
  <div>
    <a-card size="small">
      <div slot="title">
        {{ questionNumber ? questionNumber + ". " : ""
        }}{{ question.questionString }}
      </div>
      <div v-if="!isAdmin && !isSubjectLeader" slot="extra">
        <a-button size="small" type="primary" ghost @click="handleReport"
          >Report</a-button
        >
      </div>
      <a-radio-group
        class="mb-2 answerable"
        :value="
          answer
            ? answer.answeredKey
            : isReviewing && !answer
            ? ''
            : answeredKey
        "
        @change="e => handleAnswer(e)"
      >
        <a-radio
          v-for="(ans, index) in question.answers"
          :class="
            isReviewing && ans.answerId == question.answerId
              ? 'correct-answer'
              : checking
              ? 'checking'
              : isReviewing &&
                answer &&
                ans.answerId == answer.answeredKey &&
                ans.answerId != question.answerId
              ? 'wrong-answer'
              : ''
          "
          :key="ans.answerId"
          :value="ans.answerId"
        >
          {{ String.fromCharCode(97 + index).toUpperCase() }}.
          {{ ans.answerString }}
          <i
            v-if="
              isReviewing &&
                answer &&
                ans.answerId == answer.answeredKey &&
                answer.answeredKey == question.answerId &&
                !checking
            "
            class="fas fa-check mr-2"
          />
          <i
            v-else-if="
              isReviewing &&
                answer &&
                ans.answerId == answer.answeredKey &&
                answer.answeredKey != question.answerId &&
                !checking
            "
            class="fas fa-times mr-2"
            style="color: red"
          />
        </a-radio>
      </a-radio-group>
    </a-card>
    <div v-if="isReviewing">
      Question difficulty: {{ question.difficultyLevel }}
    </div>

    <a-modal
      v-model="modalVisible"
      centered
      title="Report question"
      @ok="handleOk"
    >
      <a-textarea
        v-model="reportReason"
        placeholder="Enter the reason to report this question ..."
      />
    </a-modal>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import jwtdecode from "jwt-decode";
export default {
  props: ["questionNumber", "isReviewing", "answer", "question", "checking"],
  data() {
    return {
      answeredKey: "",
      modalVisible: false,
      currentUser: jwtdecode(localStorage.getItem("token")),
      reportReason: ""
    };
  },
  mounted() {},
  computed: {
    isAdmin() {
      return this.currentUser.role === 0;
    },
    isSubjectLeader() {
      return this.currentUser.role === 1;
    }
  },
  watch: {
    isReviewing(newVal) {
      if (newVal) this.answeredKey = null;
    }
  },
  methods: {
    ...mapActions({
      reportQuestion: "questions/reportQuestion"
    }),
    handleReport() {
      this.modalVisible = true;
    },
    async handleOk() {
      let payload = {
        questionId: this.question.questionId,
        reporterId: this.currentUser.userId,
        reason: this.reportReason
      };
      await this.reportQuestion(payload);
      this.$notification.success({
        message: "Reported successfully!"
      });
      this.modalVisible = false;
    },
    handleAnswer(e) {
      if (!this.isReviewing) {
        this.answeredKey = e.target.value;
        this.$emit("answer", e.target.value);
      }
    }
  }
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

.wrong-answer {
  color: red !important;
  font-weight: bold;
}
</style>