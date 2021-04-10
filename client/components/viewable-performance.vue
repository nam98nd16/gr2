<template>
  <a-spin :spinning="loading">
    <div>
      <a-radio-group
        :class="'mb-2'"
        v-model="selectedMode"
        button-style="solid"
      >
        <a-radio-button value="rated"> Rated </a-radio-button>
        <a-radio-button value="practice">
          Learning
        </a-radio-button>
      </a-radio-group>
      <a-select
        style="min-width: 120px"
        class="mb-2"
        v-model="selectedTopicId"
        :options="
          selectedMode == 'rated'
            ? subjectOptions.filter(s => s.value)
            : subjectOptions
        "
      />
      <a-select
        v-if="selectedMode == 'practice'"
        style="min-width: 120px"
        class="mb-2"
        v-model="selectedDifficultyLevel"
        :options="difficultyOptions"
      />
      <br />
      <a-radio-group
        :class="'mb-2'"
        v-model="selectedRange"
        button-style="solid"
      >
        <a-radio-button value="today"> Today </a-radio-button>
        <a-radio-button value="30 days"> 30 Days </a-radio-button>
        <a-radio-button value="90 days">
          90 Days
        </a-radio-button>
        <a-radio-button value="1 year">
          1 Year
        </a-radio-button>
        <a-radio-button value="all time">
          All Time
        </a-radio-button>
        <a-radio-button value="custom">
          Custom
        </a-radio-button>
      </a-radio-group>
      <a-range-picker
        v-if="selectedRange == 'custom'"
        v-model="selectedRangeMoments"
      />
    </div>

    <div class="chart-title">
      {{ selectedSubjectName }}
      {{ selectedMode == "rated" ? "rating" : " - " + selectedDifficultyLabel }}
    </div>
    <apexchart
      v-if="mounted && selectedMode == 'practice' && !loading"
      height="400"
      type="bar"
      :options="chartOptions"
      :series="series"
    ></apexchart>

    <apexchart
      v-else-if="mounted && selectedMode == 'rated' && !loading"
      height="400"
      type="line"
      :options="ratedChartOptions"
      :series="ratedSeries"
    ></apexchart>
  </a-spin>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  props: ["userId"],
  data() {
    return {
      selectedTopicId: 1,
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
      selectedRangeMoments: [],
      selectedRange: "30 days",
      mounted: false,
      loading: false,
      selectedMode: "rated",
      myPerformances: [],
      myRatedPerformances: []
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
    },
    selectedMode(newVal) {
      if (newVal == "practice") this.selectedTopicId = 0;
      else this.selectedTopicId = 1;
      this.fetchData();
    },
    selectedRange(newVal) {
      if (
        newVal != "custom" ||
        (newVal == "custom" && this.selectedRangeMoments.length)
      )
        this.fetchData();
    }
  },
  methods: {
    ...mapActions({
      getMyPerformances: "performance/getMyPerformances",
      getMyRatedPerformances: "performance/getMyRatedPerformances",
      getAllSubjects: "subjects/getAllSubjects"
    }),
    getDateRange() {
      let range = {
        startDate: null,
        endDate: null
      };
      if (this.selectedRange == "30 days")
        range.startDate = this.$moment()
          .subtract(30, "days")
          .format("YYYY-MM-DD");
      else if (this.selectedRange == "90 days")
        range.startDate = this.$moment()
          .subtract(90, "days")
          .format("YYYY-MM-DD");
      else if (this.selectedRange == "1 year")
        range.startDate = this.$moment()
          .subtract(1, "year")
          .format("YYYY-MM-DD");
      else if (this.selectedRange == "all time")
        range.startDate = this.$moment()
          .subtract(20, "year")
          .format("YYYY-MM-DD");
      else if (this.selectedRange == "today") {
        range.startDate = this.$moment().format("YYYY-MM-DD");
        range.endDate = range.startDate;
      } else if (this.selectedRangeMoments.length) {
        range.startDate = this.selectedRangeMoments[0].format("YYYY-MM-DD");
        range.endDate = this.selectedRangeMoments[1].format("YYYY-MM-DD");
      }

      return range;
    },
    async fetchData() {
      let performancePayload = {
        userId: this.userId,
        subjectId: this.selectedTopicId,
        difficultyLevel:
          this.selectedMode == "rated"
            ? undefined
            : this.selectedDifficultyLevel,
        ...this.getDateRange()
      };
      this.loading = true;
      if (this.selectedMode == "rated")
        this.myRatedPerformances = await this.getMyRatedPerformances(
          performancePayload
        );
      else
        this.myPerformances = await this.getMyPerformances(performancePayload);
      this.loading = false;
    }
  },
  computed: {
    ...mapState({
      allSubjects: state => state.subjects.allSubjects
    }),
    filteredPerformances() {
      return this.selectedMode == "rated"
        ? this.myRatedPerformances
        : this.myPerformances;
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
          },
          labels: {
            show: this.filteredPerformances.length > 20 ? false : true
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
    ratedChartOptions() {
      let options = {
        chart: {
          height: 400,
          type: "line",
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "straight"
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        xaxis: {
          categories: this.filteredPerformances.map(p =>
            this.$moment(p.submittedTime).format(
              this.hasSelectedOnlyOneDay ? "YYYY/MM/DD HH:mm:ss" : "YYYY/MM/DD"
            )
          ),
          labels: {
            show: this.filteredPerformances.length > 20 ? false : true
          }
        }
      };

      return options;
    },
    ratedSeries() {
      return [
        {
          name: this.selectedSubjectName + " rating",
          data: this.filteredPerformances.map(p => p.updatedRating.toFixed(2))
        }
      ];
    },
    selectedSubjectName() {
      return this.subjectOptions.find(s => s.value == this.selectedTopicId)
        ?.label;
    },
    selectedDifficultyLabel() {
      return this.difficultyOptions.find(
        d => d.value == this.selectedDifficultyLevel
      )?.label;
    },
    hasSelectedOnlyOneDay() {
      let range = {
        startDate: null,
        endDate: null
      };
      if (this.selectedRange == "30 days")
        range.startDate = this.$moment()
          .subtract(30, "days")
          .format("YYYY-MM-DD");
      else if (this.selectedRange == "90 days")
        range.startDate = this.$moment()
          .subtract(90, "days")
          .format("YYYY-MM-DD");
      else if (this.selectedRange == "1 year")
        range.startDate = this.$moment()
          .subtract(1, "year")
          .format("YYYY-MM-DD");
      else if (this.selectedRange == "all time")
        range.startDate = this.$moment()
          .subtract(20, "year")
          .format("YYYY-MM-DD");
      else if (this.selectedRange == "today") {
        range.startDate = this.$moment().format("YYYY-MM-DD");
        range.endDate = range.startDate;
      } else if (this.selectedRangeMoments.length) {
        (range.startDate = this.selectedRangeMoments[0].format("YYYY-MM-DD")),
          (range.endDate = this.selectedRangeMoments[1].format("YYYY-MM-DD"));
      }

      return (
        range.startDate && range.endDate && range.startDate == range.endDate
      );
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