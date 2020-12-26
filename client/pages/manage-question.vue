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
      title="Propose new question"
      @ok="handleProposeQuestion"
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

    <a-checkable-tag class="mt-2" v-model="checked1" @change="handleChange">
      Questions waiting for review
    </a-checkable-tag>
    <a-checkable-tag v-model="checked2" @change="handleChange">
      Reported questions
    </a-checkable-tag>
    <a-checkable-tag v-model="checked3" @change="handleChange">
      Questions waiting for assignee
    </a-checkable-tag>
    <br /><br />

    <Question class="mt-2" />
    <Question class="mt-2" />
    <Question class="mt-2" />
    <Question class="mt-2" />
    <Question class="mt-2" />

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
export default {
  components: { Question, PageTitle },
  data() {
    return {
      checked1: false,
      checked2: false,
      checked3: false,
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
      subjects: []
    };
  },
  async mounted() {
    await this.getAllSubjects();
    this.subjects = this.allSubjects.map(subject => ({
      value: subject.subjectId,
      label: subject.subjectName
    }));
    this.subjects.unshift({ value: "", label: "Select a topic" });
  },
  computed: {
    ...mapState({
      allSubjects: state => state.subjects.allSubjects
    })
  },
  methods: {
    ...mapActions({
      getAllSubjects: "subjects/getAllSubjects",
      proposeQuestion: "questions/proposeQuestion"
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
        allowedTime: this.allowedTime
      };
      console.log("payload", payload);
      let res = await this.proposeQuestion(payload);
      this.$notification.success({
        message: "Successfully proposed the question!"
      });
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
    }
  }
};
</script>

<style scoped>
.ant-tag-checkable {
  border: 1px solid #d9d9d9;
}
</style>