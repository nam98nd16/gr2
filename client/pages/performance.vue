<template>
  <a-spin :spinning="loading">
    <page-title title="Performance monitor" />
    <div>
      <a-select
        style="min-width: 120px"
        class="mb-2"
        v-model="selectedTopicId"
        :options="subjectOptions"
      />
      <a-select
        style="min-width: 120px"
        class="mb-2"
        v-model="selectedDifficultyLevel"
        :options="difficultyOptions"
      />
      <a-range-picker
        :ranges="{
          'All Time': [$moment('2000-01-01'), $moment('2099-12-31')],
          'This Month': [$moment().startOf('month'), $moment().endOf('month')],
          'Last 3 Months': [$moment().subtract(3, 'months'), $moment()],
          'Last 6 Months': [$moment().subtract(6, 'months'), $moment()],
          'Last 12 Months': [$moment().subtract(12, 'months'), $moment()]
        }"
        v-model="selectedRangeMoments"
      />
    </div>

    <div class="chart-title">
      {{ selectedSubjectName }} - {{ selectedDifficultyLabel }}
    </div>
    <apexchart
      v-if="mounted"
      height="400"
      type="bar"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </a-spin>
</template>

<script>
import pageTitle from "../components/page-title.vue";
import { mapState, mapActions } from "vuex";
export default {
  components: { pageTitle },
  data() {
    return {
      selectedTopicId: 0,
      subjectOptions: [],
      selectedDifficultyLevel: 0,
      difficultyOptions: [
        { value: 0, label: "All Difficulty Levels" },
        { value: "adaptive", label: "Adaptive" },
        { value: "easy", label: "Easy" },
        { value: "medium", label: "Medium" },
        { value: "hard", label: "Hard" }
      ],
      dateRangeOptions: [
        {
          value: 0,
          label: "All Time"
        },
        { value: 1, label: "Last 3 months" },
        {
          value: 2,
          label: "Last 6 months"
        },
        {
          value: 3,
          label: "Last year"
        },
        {
          value: 4,
          label: "Select range"
        }
      ],
      selectedRangeMoments: [
        this.$moment("2000-01-01"),
        this.$moment("2099-12-31")
      ],
      mounted: false,
      loading: false
    };
  },
  async mounted() {
    this.loading = true;
    await Promise.all([
      this.fetchData(),
      this.allSubjects.length ? undefined : this.getAllSubjects()
    ]);
    this.subjectOptions = this.allSubjects.map(subject => ({
      value: subject.subjectId,
      label: subject.subjectName
    }));
    this.subjectOptions.unshift({ value: 0, label: "All Subjects" });
    this.mounted = true;
    this.loading = false;
  },
  watch: {
    selectedTopicId(newVal) {
      this.fetchData();
    },
    selectedDifficultyLevel(newVal) {
      this.fetchData();
    },
    selectedRangeMoments(newVal) {
      this.fetchData();
    }
  },
  methods: {
    ...mapActions({
      getMyPerformances: "performance/getMyPerformances",
      getAllSubjects: "subjects/getAllSubjects"
    }),
    async fetchData() {
      let selectedRange;
      if (this.selectedRangeMoments.length)
        selectedRange = {
          startDate: this.selectedRangeMoments[0].format("YYYY-MM-DD"),
          endDate: this.selectedRangeMoments[1].format("YYYY-MM-DD")
        };
      else
        selectedRange = {
          startDate: null,
          endDate: null
        };

      let performancePayload = {
        subjectId: this.selectedTopicId,
        difficultyLevel: this.selectedDifficultyLevel,
        ...selectedRange
      };
      this.loading = true;
      await this.getMyPerformances(performancePayload);
      this.loading = false;
    }
  },
  computed: {
    ...mapState({
      myPerformances: state => state.performance.myPerformances,
      allSubjects: state => state.subjects.allSubjects
    }),
    filteredPerformances() {
      return this.myPerformances;
    },
    series() {
      return [
        {
          name: "Number of correct answers",
          type: "column",
          data: this.filteredPerformances.map(m => m.correctAnswerCount)
        },
        {
          name: "Number of questions",
          type: "column",
          data: this.filteredPerformances.map(m => m.questionCount)
        },
        {
          name: "Correct percentage",
          type: "line",
          data: this.filteredPerformances.map(m =>
            ((m.correctAnswerCount / m.questionCount) * 100).toFixed(0)
          )
        }
      ];
    },
    categoryNames() {
      let getDifficultyLabel = value =>
        this.difficultyOptions.find(o => o.value == value).label;
      let categoryNames = this.selectedTopicId
        ? this.filteredPerformances.map(
            m =>
              `${this.$moment(m.startTime).format("YYYY/MM/DD HH:mm:ss")}
            ${
              this.selectedDifficultyLevel
                ? ""
                : "(" + getDifficultyLabel(m.difficultyLevel) + ")"
            }`
          )
        : this.filteredPerformances.map(
            m =>
              `${
                this.allSubjects.find(s => s.subjectId == m.subjectId)
                  ?.subjectName
              } ${
                this.selectedDifficultyLevel
                  ? ""
                  : "(" + getDifficultyLabel(m.difficultyLevel) + ")"
              }`
          );
      return categoryNames;
    },
    chartOptions() {
      var options = {
        chart: {
          height: 400,
          type: "line",
          stacked: false
        },
        dataLabels: {
          enabled: false
        },
        colors: ["#99C2A2", "#C5EDAC", "#66C7F4"],
        stroke: {
          width: [1, 1, 4],
          curve: "straight"
        },
        plotOptions: {
          bar: {
            columnWidth: "20%"
          }
        },
        xaxis: {
          categories: this.categoryNames,
          tooltip: {
            enabled: this.selectedTopicId == 0 ? true : false,
            formatter: (val, opts) => {
              return this.$moment(
                this.filteredPerformances[opts.dataPointIndex].startTime
              ).format("YYYY/MM/DD HH:mm:ss");
            }
          }
        },
        yaxis: [
          {
            seriesName: "Number of correct answers",
            axisTicks: {
              show: true
            },
            axisBorder: {
              show: true
            },
            title: {
              text: "Questions"
            }
          },
          {
            seriesName: "Number of correct answers",
            show: false
          },
          {
            opposite: true,
            seriesName: "Correct percentage",
            axisTicks: {
              show: true
            },
            axisBorder: {
              show: true
            },
            title: {
              text: "Correct percentage"
            }
          }
        ],
        tooltip: {
          theme: "dark",
          shared: true,
          intersect: false,
          x: {
            show: false
          },
          y: {
            formatter: (value, { series, seriesIndex, dataPointIndex, w }) =>
              `${value}${seriesIndex == 2 ? "%" : ""}`
          },
          fixed: {
            enabled: true,
            position: "topLeft",
            offsetX: 0,
            offsetY: 0
          }
        },
        legend: {
          horizontalAlign: "left",
          offsetX: 40
        }
      };
      return options;
    },
    selectedSubjectName() {
      return this.subjectOptions.find(s => s.value == this.selectedTopicId)
        ?.label;
    },
    selectedDifficultyLabel() {
      return this.difficultyOptions.find(
        d => d.value == this.selectedDifficultyLevel
      )?.label;
    }
  }
};
</script>

<style>
.chart-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 700;
  text-align: center;
  padding: 0px 10px;
  color: #000;
}
</style>