<template>
  <div>
    <a-card size="small">
      <template slot="title">
        <a-row :gutter="4" type="flex" align="top" justify="start">
          <a-col :md="12" :xs="24">
            {{ question.questionString }}
            <div>
              <a-tag color="green">{{
                allSubjects.find(
                  subject => subject.subjectId == question.subjectId
                ).subjectName
              }}</a-tag>
              <a-tag v-if="isRejected" color="red">Rejected</a-tag>

              <span v-else>
                <a-tag v-if="isWaitingForPreliminaryReview" color="blue"
                  >Waiting for preliminary review</a-tag
                >
                <a-tag v-if="isWaitingForAssignee" color="blue"
                  >Waiting for assignee</a-tag
                >
                <a-tag v-if="isWaitingForPeerReview" color="blue"
                  >Waiting for peer review</a-tag
                >
                <a-tag v-if="isWaitingForFinalReview" color="blue"
                  >Waiting for final review</a-tag
                ></span
              >

              <a-tooltip placement="right">
                <template slot="title">
                  <div>
                    This question has been reported by:
                  </div>
                  <div v-for="(report, index) in question.reports" :key="index">
                    <span style="font-weight: bold">{{ report.username }}</span
                    >:
                    <span style="font-style: italic">{{ report.reason }}</span>
                  </div>
                </template>
                <i
                  v-if="isReported && canHandleReport"
                  class="fas fa-exclamation-circle pointer-cursor"
                ></i>
              </a-tooltip>
              <a-tag color="blue" title="Allowed time for the question">
                <i class="fas fa-clock"></i> {{ question.timeAllowed }}</a-tag
              >
              <a-tag color="red" title="Difficulty level"
                ><i class="fas fa-skull-crossbones"></i>
                {{ question.difficultyLevel }}
              </a-tag>

              <div
                v-if="isRejected"
                style="font-style: italic; font-weight: 400"
              >
                <span v-if="question.passedPreliminaryReview === '0'"
                  ><span class="reviewer">Preliminary reviewer:</span>
                  {{ question.rejectReason }}</span
                >
                <div v-else-if="question.passedPeerReview === '0'">
                  <div>
                    <span class="reviewer">Expert 1:</span>
                    {{ getRejectReason(0) }}
                  </div>
                  <div>
                    <span class="reviewer">Expert 2:</span>
                    {{ getRejectReason(1) }}
                  </div>
                  <div v-if="getRejectReason(2)">
                    <span class="reviewer">Expert 3:</span>
                    {{ getRejectReason(2) }}
                  </div>
                </div>
                <div v-else>
                  <span class="reviewer">Subject leader:</span>
                  {{ question.rejectReason }}
                </div>
              </div>
            </div>
          </a-col>
          <a-col :md="12" :xs="24">
            <span style="float: right">
              <a-button
                v-if="isRejected || (isReported && canHandleReport)"
                size="small"
                type="primary"
                @click="handleUpdate"
                >{{
                  isRejected
                    ? "Update for review again"
                    : "Update and clear reports"
                }}</a-button
              >
              <span v-if="isAuthorized && !isRejected">
                <a-button size="small" type="primary" @click="handleApprove"
                  >Approve</a-button
                >
                <a-button
                  size="small"
                  type="danger"
                  ghost
                  @click="modalRejectIsVisible = true"
                  >Reject</a-button
                ></span
              >
              <span v-if="isWaitingForAssignee && canAssignQuestions">
                <a-select
                  size="small"
                  placeholder="Select 3 assignees for peer reviews"
                  style="min-width: 255px; font-weight: 400"
                  mode="multiple"
                  class="mb-1 mt-1"
                  v-model="selectedAssignees"
                >
                  <a-select-option
                    v-for="assignee in availableAssignees"
                    :key="assignee.userId"
                    >{{ assignee.username }}</a-select-option
                  >
                </a-select>
                <a-button
                  size="small"
                  type="primary"
                  :disabled="selectedAssignees.length != 3"
                  @click="handleConfirmingAssignees"
                  >Confirm assignees</a-button
                >
              </span>
              <a-button
                v-if="isReported && canHandleReport"
                size="small"
                type="danger"
                ghost
                @click="handleIgnore"
                >Ignore reports</a-button
              >
              <a-button
                v-if="
                  !isSubjectLeader &&
                    !isAdmin &&
                    !isRejected &&
                    question.passedFinalReview == 1
                "
                size="small"
                type="primary"
                ghost
                @click="handleReport"
                >Report</a-button
              >
              <a-button
                v-if="canDelete"
                size="small"
                type="danger"
                @click="handleDeletion"
                >Delete</a-button
              >
            </span>
          </a-col>
        </a-row>
      </template>
      <div
        :style="getAnswerStyle(answer.isCorrect)"
        v-for="(answer, index) in question.answers"
        :key="answer.answerId"
      >
        {{ String.fromCharCode(97 + index).toUpperCase() }}.
        {{ answer.answerString }}
      </div>
    </a-card>

    <a-modal
      v-model="modalRejectIsVisible"
      centered
      title="Reject question"
      :okButtonProps="{ props: { disabled: !rejectReason } }"
      @ok="handleReject"
    >
      <a-textarea
        v-model="rejectReason"
        placeholder="Enter the reason why this question is rejected ..."
      />
    </a-modal>

    <a-modal
      v-model="modalVisible"
      centered
      title="Report question"
      :okButtonProps="{ props: { disabled: !reportReason } }"
      @ok="handleOk"
    >
      <a-textarea
        placeholder="Enter the reason to report this question ..."
        v-model="reportReason"
      />
    </a-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import jwtdecode from "jwt-decode";
export default {
  props: ["question"],
  data() {
    return {
      modalVisible: false,
      modalRejectIsVisible: false,
      currentUser: jwtdecode(localStorage.getItem("token")),
      selectedAssignees: [],
      rejectReason: "",
      reportReason: ""
    };
  },
  computed: {
    ...mapState({
      allSubjects: state => state.subjects.allSubjects,
      availableAssignees: state => state.questions.availableAssignees
    }),
    isNormalUser() {
      return this.currentUser.role === 3;
    },
    isAdmin() {
      return this.currentUser.role === 0;
    },
    isSubjectExpert() {
      return this.currentUser.role === 2;
    },
    isSubjectLeader() {
      return this.currentUser.role === 1;
    },
    isPreliminaryReviewer() {
      return this.currentUser.role === 4;
    },
    isWaitingForPreliminaryReview() {
      return this.question.passedPreliminaryReview === "0";
    },
    isWaitingForAssignee() {
      return (
        this.question.passedPreliminaryReview === "1" &&
        this.question.hasBeenAssigned === "0"
      );
    },
    isWaitingForPeerReview() {
      return (
        this.question.passedPreliminaryReview === "1" &&
        this.question.hasBeenAssigned === "1" &&
        this.question.passedPeerReview === "0"
      );
    },
    isWaitingForFinalReview() {
      return (
        this.question.passedPreliminaryReview === "1" &&
        this.question.passedPeerReview === "1" &&
        this.question.passedFinalReview === "0"
      );
    },
    isRejected() {
      return this.question.hasBeenRejected === "1";
    },
    isReported() {
      return this.question.hasBeenReported === "1";
    },
    isAuthorized() {
      let isAuthorizedForPreliminaryReview =
        this.isPreliminaryReviewer && this.isWaitingForPreliminaryReview;

      let assigneeIndex = this.question.assignees?.findIndex(
        assignee => assignee.reviewerId == this.currentUser.userId
      );
      let isAuthorizedForPeerReview =
        this.isWaitingForPeerReview &&
        assigneeIndex >= 0 &&
        this.question.assignees[assigneeIndex].hasApproved === "0";

      let isAuthorizedForFinalReview =
        (this.isSubjectLeader || this.isAdmin) &&
        this.isWaitingForFinalReview &&
        this.question.subjectId == this.currentUser.subjectId;
      return (
        isAuthorizedForPreliminaryReview ||
        isAuthorizedForPeerReview ||
        isAuthorizedForFinalReview
      );
    },
    canAssignQuestions() {
      return (
        (this.isSubjectLeader || this.isAdmin) &&
        this.question.subjectId == this.currentUser.subjectId
      );
    },
    canHandleReport() {
      return (
        (this.isSubjectLeader || this.isAdmin) &&
        this.question.subjectId == this.currentUser.subjectId
      );
    },
    canDelete() {
      let isTopicLeader =
        this.isSubjectLeader &&
        this.question.subjectId == this.currentUser.subjectId;
      return this.isAdmin || isTopicLeader;
    }
  },
  methods: {
    ...mapActions({
      approveQuestions: "questions/approveQuestions",
      rejectQuestions: "questions/rejectQuestions",
      reportQuestion: "questions/reportQuestion",
      ignoreReports: "questions/ignoreReports",
      deleteQuestion: "questions/deleteQuestion",
      getAvailableAssignees: "questions/getAvailableAssignees",
      setAssignees: "questions/setAssignees"
    }),
    handleDeletion() {
      this.$confirm({
        title:
          "Are you sure to remove the question from the system? This action CANNOT be undone!",
        okText: "OK",
        cancelText: "Cancel",
        onOk: async () => {
          await this.deleteQuestion(this.question.questionId);
          this.$notification.success({
            message: "Delete successfully!"
          });
          this.$emit("delete");
        },
        onCancel() {}
      });
    },
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
    handleApprove() {
      this.$confirm({
        title: "Are you sure to approve the question?",
        okText: "OK",
        cancelText: "Cancel",
        onOk: async () => {
          let payload = {
            isForPreliminaryReview: this.isWaitingForPreliminaryReview,
            isForPeerReview: this.isWaitingForPeerReview,
            isForFinalReview: this.isWaitingForFinalReview,
            questionId: this.question.questionId
          };
          await this.approveQuestions(payload);
          this.$notification.success({
            message: "Approved successfully!"
          });
          this.$emit("approve");
        },
        onCancel() {}
      });
    },
    handleReject() {
      this.$confirm({
        title: "Are you sure to reject the question?",
        okText: "OK",
        cancelText: "Cancel",
        onOk: async () => {
          let payload = {
            isForPreliminaryReview: this.isWaitingForPreliminaryReview,
            isForPeerReview: this.isWaitingForPeerReview,
            isForFinalReview: this.isWaitingForFinalReview,
            questionId: this.question.questionId,
            rejectReason: this.rejectReason
          };
          await this.rejectQuestions(payload);
          this.$notification.success({
            message: "Rejected successfully!"
          });
          this.$emit("reject");
          this.modalRejectIsVisible = false;
        },
        onCancel: () => {}
      });
    },
    handleUpdate() {
      this.$emit("update", this.question);
    },
    async handleConfirmingAssignees() {
      let payload = {
        assigneeIds: this.selectedAssignees,
        questionId: this.question.questionId
      };
      await this.setAssignees(payload);
      this.$notification.success({
        message: "Assigned successfully!"
      });
      this.$emit("assign");
    },
    getAnswerStyle(isCorrect) {
      if (isCorrect) {
        return "color: blue; font-weight: bold";
      } else return "";
    },
    getRejectReason(index) {
      let rejectAssignees = this.question.assignees.filter(
        assignee => assignee.hasRejected === "1"
      );
      return rejectAssignees[index]?.rejectReason;
    },
    async handleIgnore() {
      this.$confirm({
        title: "Are you sure to ignore all reports of this question?",
        okText: "OK",
        cancelText: "Cancel",
        onOk: async () => {
          await this.ignoreReports({ questionId: this.question.questionId });

          this.$notification.success({
            message: "Ignore reports successfully!"
          });
          this.$emit("ignore");
          this.modalRejectIsVisible = false;
        },
        onCancel: () => {}
      });
    }
  }
};
</script>

<style>
.reviewer {
  font-style: italic;
  font-weight: 500;
}

.pointer-cursor {
  cursor: pointer;
}
</style>