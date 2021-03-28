<template>
  <div>
    <PageTitle :title="'Leaderboard'" />
    <a-radio-group
      class="mb-2"
      v-model="selectedSubjectId"
      button-style="solid"
    >
      <a-radio-button
        v-for="subject in subjectOptions"
        :value="subject.value"
        :key="subject.value"
      >
        {{ subject.label }}
      </a-radio-button>
    </a-radio-group>

    <a-table
      :columns="columns"
      :data-source="topRatings"
      :pagination="false"
      :rowKey="(r, i) => i"
      bordered
      :showHeader="false"
      size="middle"
    >
      <template slot="no" slot-scope="text, record, index">
        <div :style="getStyle(index)">
          {{ index + 1 }}
        </div>
      </template>
      <template slot="username" slot-scope="text, record, index">
        <span :style="getStyle(index)">
          <i v-if="[0, 1, 2].includes(index)" class="fas fa-trophy mr-1"> </i
          >{{ text }}</span
        >
      </template>
      <template slot="rating" slot-scope="text, record, index">
        <span :style="getStyle(index)">{{ text.toFixed(2) }}</span>
      </template>
    </a-table>
  </div>
</template>

<script>
import PageTitle from "../components/page-title.vue";
import { mapActions, mapState } from "vuex";
export default {
  components: { PageTitle },
  data() {
    return {
      subjectOptions: [],
      selectedSubjectId: 1
    };
  },
  watch: {
    selectedSubjectId(newVal) {
      this.getTopRatings(this.selectedSubjectId);
    }
  },
  async mounted() {
    this.initSubjectOptions();
    this.getTopRatings(this.selectedSubjectId);
  },
  computed: {
    ...mapState({
      topRatings: state => state.performance.topRatings,
      allSubjects: state => state.subjects.allSubjects
    }),
    columns() {
      return [
        {
          title: "No.",
          scopedSlots: { customRender: "no" }
        },
        {
          title: "Username",
          dataIndex: "username",
          scopedSlots: { customRender: "username" }
        },
        {
          title: "Rating",
          dataIndex: "rating",
          scopedSlots: { customRender: "rating" }
        }
      ];
    }
  },
  methods: {
    ...mapActions({
      getTopRatings: "performance/getTopRatings",
      getAllSubjects: "subjects/getAllSubjects"
    }),
    async initSubjectOptions() {
      this.allSubjects.length ? {} : await this.getAllSubjects();
      this.subjectOptions = this.allSubjects.map(subject => ({
        value: subject.subjectId,
        label: subject.subjectName
      }));
    },
    getStyle(index) {
      return !index
        ? "color: gold; font-weight: 500"
        : index === 1
        ? "color: silver; font-weight: 500"
        : index === 2
        ? "color: #C9AE5D; font-weight: 500"
        : "";
    }
  }
};
</script>