<template>
  <div>
    <page-title title="Question management" />
    <a-input
      placeholder="Search for questions"
      style="width: 400px"
      v-model="filterText"
      @change="search"
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
      @change="e => handleChange(e, 'wfReviewFiltered')"
    >
      Questions waiting for my review
    </a-checkable-tag>
    <a-checkable-tag
      v-if="isAdmin || isSubjectLeader"
      v-model="reportedFiltered"
      @change="e => handleChange(e, 'reportedFiltered')"
    >
      Reported questions
    </a-checkable-tag>
    <a-checkable-tag
      v-if="isSubjectLeader || isAdmin"
      v-model="wfAssigneeFiltered"
      @change="e => handleChange(e, 'wfAssigneeFiltered')"
    >
      Questions waiting for assignee
    </a-checkable-tag>
    <a-checkable-tag
      v-model="myQuestionsFiltered"
      @change="e => handleChange(e, 'myQuestionsFiltered')"
    >
      My proposed questions
    </a-checkable-tag>
    <br /><br />

    <Question
      v-for="question in viewableQuestions"
      :key="question.questionId"
      :question="question"
      @approve="fetchViewableQuestions(true)"
      @assign="fetchViewableQuestions(true)"
      @reject="fetchViewableQuestions(true)"
      @delete="fetchViewableQuestions(true)"
      @ignore="fetchViewableQuestions(true)"
      @update="handleUpdate"
      class="mt-2"
    />

    <a-pagination
      class="mt-2"
      style="float: right"
      v-model="currentPage"
      :pageSize="perPage"
      showLessItems
      :total="viewableQuestionsCount"
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
      perPage: 5,
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
      questionToUpdate: null,
      filterText: "",
      search: _.debounce(() => {
        this.currentPage = 1;
        this.fetchViewableQuestions();
      }, 300)
    };
  },
  async mounted() {
    if (this.isNormalUser) this.myQuestionsFiltered = true;
    else if (this.isPreliminaryReviewer) this.wfReviewFiltered = true;
    await Promise.all([
      this.allSubjects.length ? undefined : this.getAllSubjects(),
      this.fetchViewableQuestions(),
      this.getAvailableAssignees()
    ]);
    this.subjects = this.allSubjects.map(subject => ({
      value: subject.subjectId,
      label: subject.subjectName
    }));
    this.subjects.unshift({ value: "", label: "Select a topic" });
  },
  computed: {
    ...mapState({
      allSubjects: state => state.subjects.allSubjects,
      allQuestions: state => state.questions.allQuestions,
      viewableQuestions: state => state.questions.viewableQuestions,
      viewableQuestionsCount: state => state.questions.viewableQuestionsCount,
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
    }
  },
  watch: {
    currentPage(newVal) {
      this.fetchViewableQuestions();
    }
  },
  methods: {
    ...mapActions({
      getAllSubjects: "subjects/getAllSubjects",
      proposeQuestion: "questions/proposeQuestion",
      updateQuestion: "questions/updateQuestion",
      getAllQuestions: "questions/getAllQuestions",
      getViewableQuestions: "questions/getViewableQuestions",
      getViewableQuestionsCount: "questions/getViewableQuestionsCount",
      getAvailableAssignees: "questions/getAvailableAssignees"
    }),
    async fetchViewableQuestions(afterDeletion) {
      let payload = {
        keyword: this.filterText,
        wfReviewFiltered: this.wfReviewFiltered,
        wfAssigneeFiltered: this.wfAssigneeFiltered,
        reportedFiltered: this.reportedFiltered,
        myQuestionsFiltered: this.myQuestionsFiltered,
        perPage: this.perPage,
        currentPage: this.currentPage
      };
      this.getViewableQuestions(payload);
      await this.getViewableQuestionsCount(payload);
      if (
        this.viewableQuestionsCount % 5 == 0 &&
        afterDeletion &&
        this.currentPage > 1 &&
        this.currentPage == this.viewableQuestionsCount / 5 + 1
      )
        this.currentPage--;
    },
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
      this.fetchViewableQuestions();
      this.modalVisible = false;
    },
    handleChange(e, type) {
      if (e) {
        let excludedFilters = [
          "wfReviewFiltered",
          "reportedFiltered",
          "wfAssigneeFiltered",
          "myQuestionsFiltered"
        ];
        excludedFilters = excludedFilters.filter(e => e != type);

        excludedFilters.forEach(e => {
          this[e] = false;
        });
      }

      this.currentPage = 1;
      this.fetchViewableQuestions();
    },
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