<template>
  <div>
    <page-title title="Question management" />
    <a-input-search
      placeholder="Search for questions"
      style="width: 400px"
      enter-button="Search"
      @search="onSearch"
    />

    <a-button type="primary" @click="modalVisible = true"
      ><i class="fas fa-plus mr-2"></i>Create a new question</a-button
    >
    <a-modal
      v-model="modalVisible"
      centered
      :title="questionToUpdate ? 'Update question' : 'Propose new question'"
      @ok="handleProposeQuestion"
      @cancel="questionToUpdate = null"
    >
      <a-textarea
        autosize
        placeholder="Enter question ..."
        v-model="questionString"
      />
      <a-row :gutter="4" type="flex" align="middle" justify="space-between">
        <a-col :span="18">
          <a-input
            class="mt-2"
            placeholder="Enter answer ..."
            v-model="answer1.string"
          /> </a-col
        ><a-col :span="6"
          ><a-checkbox
            :checked="answer1.isCorrect"
            @change="
              e => handleCorrectAnswerChange('answer1', e.target.checked)
            "
          />
          Correct answer</a-col
        >
      </a-row>
      <a-row :gutter="4" type="flex" align="middle" justify="space-between">
        <a-col :span="18">
          <a-input
            class="mt-2"
            placeholder="Enter answer ..."
            v-model="answer2.string"
          /> </a-col
        ><a-col :span="6"
          ><a-checkbox
            :checked="answer2.isCorrect"
            @change="
              e => handleCorrectAnswerChange('answer2', e.target.checked)
            "
          />
          Correct answer</a-col
        >
      </a-row>
      <a-row :gutter="4" type="flex" align="middle" justify="space-between">
        <a-col :span="18">
          <a-input
            class="mt-2"
            placeholder="Enter answer ..."
            v-model="answer3.string"
          /> </a-col
        ><a-col :span="6"
          ><a-checkbox
            :checked="answer3.isCorrect"
            @change="
              e => handleCorrectAnswerChange('answer3', e.target.checked)
            "
          />
          Correct answer</a-col
        >
      </a-row>
      <a-row :gutter="4" type="flex" align="middle" justify="space-between">
        <a-col :span="18">
          <a-input
            class="mt-2"
            placeholder="Enter answer ..."
            v-model="answer4.string"
          /> </a-col
        ><a-col :span="6"
          ><a-checkbox
            :checked="answer4.isCorrect"
            @change="
              e => handleCorrectAnswerChange('answer4', e.target.checked)
            "
          />
          Correct answer</a-col
        >
      </a-row>

      Topic
      <br />
      <a-select
        :disabled="!!questionToUpdate"
        style="min-width: 150px"
        class="mb-2"
        v-model="selectedTopic"
        :options="subjects"
      />

      <br />
      Difficulty level
      <br />
      <a-radio-group
        class="mb-2"
        :options="[
          { value: 1, label: '1' },
          { value: 2, label: '2' },
          { value: 3, label: '3' },
          { value: 4, label: '4' },
          { value: 5, label: '5' },
          { value: 6, label: '6' },
          { value: 7, label: '7' },
          { value: 8, label: '8' },
          { value: 9, label: '9' }
        ]"
        v-model="difficultyLevel"
        @change="handleChange"
      />

      <br />
      Allowed time
      <br />
      <a-slider
        :marks="{ 0: '0', 30: '30', 60: '60' }"
        v-model="allowedTime"
        :min="0"
        :max="60"
      />
    </a-modal>
    <br />

    <a-checkable-tag
      v-if="!isNormalUser"
      class="mt-2"
      v-model="wfReviewFiltered"
      @change="handleChange"
    >
      Questions waiting for my review
    </a-checkable-tag>
    <a-checkable-tag
      v-if="!isNormalUser && !isPreliminaryReviewer"
      v-model="reportedFiltered"
      @change="handleChange"
    >
      Reported questions
    </a-checkable-tag>
    <a-checkable-tag
      v-if="isSubjectLeader || isAdmin"
      v-model="wfAssigneeFiltered"
      @change="handleChange"
    >
      Questions waiting for assignee
    </a-checkable-tag>
    <a-checkable-tag v-model="myQuestionsFiltered" @change="handleChange">
      My proposed questions
    </a-checkable-tag>
    <br /><br />

    <Question
      v-for="question in filteredQuestions"
      :key="question.questionId"
      :question="question"
      @approve="getAllQuestions"
      @assign="getAllQuestions"
      @reject="getAllQuestions"
      @delete="getAllQuestions"
      @update="handleUpdate"
      class="mt-2"
    />

    <a-pagination
      class="mt-2"
      style="float: right"
      v-model="currentPage"
      :total="50"
      show-less-items
    />
  </div>
</template>

<script>
import Question from "@/components/question";
import PageTitle from "../components/page-title.vue";
import { mapActions, mapState } from "vuex";
import jwtdecode from "jwt-decode";
export default {
  components: { Question, PageTitle },
  data() {
    return {
      modalVisible: false,
      selectedTopic: "",
      allowedTime: 30,
      difficultyLevel: 1,
      currentPage: 1,
      answer1: {
        string: "",
        isCorrect: true
      },
      answer2: {
        string: "",
        isCorrect: false
      },
      answer3: {
        string: "",
        isCorrect: false
      },
      answer4: {
        string: "",
        isCorrect: false
      },
      questionString: "",
      subjects: [],
      currentUser: jwtdecode(localStorage.getItem("token")),
      wfReviewFiltered: false,
      reportedFiltered: false,
      wfAssigneeFiltered: false,
      myQuestionsFiltered: false,
      questionToUpdate: null
    };
  },
  async mounted() {
    await Promise.all([
      this.getAllSubjects(),
      this.getAllQuestions(),
      this.getAvailableAssignees()
    ]);
    this.subjects = this.allSubjects.map(subject => ({
      value: subject.subjectId,
      label: subject.subjectName
    }));
    this.subjects.unshift({ value: "", label: "Select a topic" });
    if (this.isNormalUser) this.myQuestionsFiltered = true;
  },
  computed: {
    ...mapState({
      allSubjects: state => state.subjects.allSubjects,
      allQuestions: state => state.questions.allQuestions,
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
    filteredQuestions() {
      let filteredQuestions = this.allQuestions.filter(question => {
        if (
          !this.wfReviewFiltered &&
          !this.wfAssigneeFiltered &&
          !this.reportedFiltered &&
          !this.myQuestionsFiltered
        ) {
          if (this.isNormalUser) return false;
          else return question.passedFinalReview === "1";
        }
        let isRenderedWfReview = true;
        if (this.wfReviewFiltered) {
          if (this.isPreliminaryReviewer)
            isRenderedWfReview =
              question.passedPreliminaryReview === "0" &&
              question.hasBeenRejected === "0";
          else if (this.isSubjectExpert) {
            let assigneeIndex = question.assignees?.findIndex(
              assignee => assignee.reviewerId == this.currentUser.userId
            );
            let isAuthorizedForPeerReview =
              assigneeIndex >= 0 &&
              question.assignees[assigneeIndex].hasApproved === "0";
            let hasRejected =
              assigneeIndex >= 0 &&
              question.assignees[assigneeIndex].hasRejected === "1";
            isRenderedWfReview =
              question.hasBeenAssigned === "1" &&
              isAuthorizedForPeerReview &&
              !hasRejected &&
              question.passedPeerReview === "0" &&
              question.hasBeenRejected === "0";
          } else if (this.isSubjectLeader || this.isAdmin) {
            let assigneeIndex = question.assignees?.findIndex(
              assignee => assignee.reviewerId == this.currentUser.userId
            );
            let isAuthorizedForPeerReview =
              assigneeIndex >= 0 &&
              question.assignees[assigneeIndex].hasApproved === "0";
            isRenderedWfReview =
              ((question.subjectId == this.currentUser.subjectId &&
                question.passedPreliminaryReview === "1" &&
                question.passedPeerReview === "1" &&
                question.passedFinalReview === "0") ||
                (question.hasBeenAssigned === "1" &&
                  isAuthorizedForPeerReview)) &&
              question.hasBeenRejected === "0";
          }
        }
        let isRenderedReported = true;
        if (this.reportedFiltered)
          isRenderedReported = question.hasBeenReported === "1";
        let isRenderedWfAssignee = true;
        if (this.wfAssigneeFiltered)
          isRenderedWfAssignee =
            question.passedPreliminaryReview === "1" &&
            question.hasBeenAssigned === "0" &&
            question.subjectId == this.currentUser.subjectId &&
            question.hasBeenRejected === "0";
        let isRenderedMyQuestions = true;
        if (this.myQuestionsFiltered)
          isRenderedMyQuestions = question.creatorId == this.currentUser.userId;
        return (
          isRenderedWfReview &&
          isRenderedReported &&
          isRenderedWfAssignee &&
          isRenderedMyQuestions
        );
      });
      console.log("filtered", filteredQuestions);
      return filteredQuestions;
    }
  },
  methods: {
    ...mapActions({
      getAllSubjects: "subjects/getAllSubjects",
      proposeQuestion: "questions/proposeQuestion",
      updateQuestion: "questions/updateQuestion",
      getAllQuestions: "questions/getAllQuestions",
      getAvailableAssignees: "questions/getAvailableAssignees"
    }),
    onSearch() {},
    async handleProposeQuestion() {
      if (
        !this.selectedTopic ||
        !this.questionString ||
        !this.answer3.string ||
        !this.answer2.string ||
        !this.answer1.string ||
        !this.answer4.string
      ) {
        this.$notification.error({
          message: "Please enter all the required information!"
        });
        return;
      }
      let payload = {
        questionString: this.questionString,
        answer1: this.answer1,
        answer2: this.answer2,
        answer3: this.answer3,
        answer4: this.answer4,
        topicId: this.selectedTopic,
        difficultyLevel: this.difficultyLevel,
        allowedTime: this.allowedTime,
        questionId: this.questionToUpdate?.questionId ?? undefined
      };
      if (this.questionToUpdate) {
        let res = await this.updateQuestion(payload);
        this.$notification.success({
          message: "Successfully updated the question!"
        });
      } else {
        let res = await this.proposeQuestion(payload);
        this.$notification.success({
          message: "Successfully proposed the question!"
        });
      }
      this.getAllQuestions();
      this.modalVisible = false;
    },
    handleChange() {},
    handleCorrectAnswerChange(answer, checked) {
      if (checked) {
        let answersTitle = ["answer1", "answer2", "answer3", "answer4"];
        this[answer].isCorrect = checked;
        answersTitle.splice(
          answersTitle.findIndex(ans => ans == answer),
          1
        );
        answersTitle.forEach(ans => {
          this[ans].isCorrect = false;
        });
      }
    },
    handleUpdate(question) {
      this.questionToUpdate = question;
      this.questionString = question.questionString;
      this.answer1 = {
        string: question.answers[0].answerString,
        isCorrect: question.answers[0].isCorrect,
        id: question.answers[0].answerId
      };
      this.answer2 = {
        string: question.answers[1].answerString,
        isCorrect: question.answers[1].isCorrect,
        id: question.answers[1].answerId
      };
      this.answer3 = {
        string: question.answers[2].answerString,
        isCorrect: question.answers[2].isCorrect,
        id: question.answers[2].answerId
      };
      this.answer4 = {
        string: question.answers[3].answerString,
        isCorrect: question.answers[3].isCorrect,
        id: question.answers[3].answerId
      };
      this.selectedTopic = parseInt(question.subjectId);
      this.difficultyLevel = question.difficultyLevel;
      this.allowedTime = question.timeAllowed;
      this.modalVisible = true;
    }
  }
};
</script>

<style scoped>
.ant-tag-checkable {
  border: 1px solid #d9d9d9;
}
</style>