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
      @ok="handleOk"
    >
      <a-textarea placeholder="Enter question ..." />
      <a-input class="mt-2" placeholder="Enter answer ..." />
      <a-input class="mt-2" placeholder="Enter answer ..." />
      <a-input class="mt-2" placeholder="Enter answer ..." />
      <a-input class="mt-2 mb-2" placeholder="Enter answer ..." />

      Topic
      <br />
      <a-select
        style="min-width: 120px"
        class="mb-2"
        v-model="selectedTopic"
        :options="[
          { value: '', label: 'Select a topic' },
          { value: 'math', label: 'Math' },
          { value: 'english', label: 'English' },
        ]"
      />

      <br />
      Difficulty level
      <br />
      <a-radio-group
        class="mb-2"
        :options="[
          { value: '1', label: '1' },
          { value: '2', label: '2' },
          { value: '3', label: '3' },
          { value: '4', label: '4' },
          { value: '5', label: '5' },
          { value: '6', label: '6' },
          { value: '7', label: '7' },
          { value: '8', label: '8' },
          { value: '9', label: '9' },
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
      difficultyLevel: "1",
      currentPage: 1,
    };
  },
  methods: {
    onSearch() {},
    handleOk() {
      this.modalVisible = false;
    },
    handleChange() {},
  },
};
</script>

<style scoped>
.ant-tag-checkable {
  border: 1px solid #d9d9d9;
}
</style>