<template>
  <div>
    <page-title title="Performance" />
    <div>
      Select topic
      <br />
      <a-select
        style="min-width: 120px"
        class="mb-2"
        v-model="selectedTopicId"
        :options="subjectOptions"
      />
    </div>
    <div class="chart-title">
      Performance Over Time
    </div>
    <div class="chart-title">
      {{ selectedSubjectName }}
    </div>
    <apexchart
      height="500"
      type="bar"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
import pageTitle from "../components/page-title.vue";
import { mapState, mapActions } from "vuex";
export default {
  components: { pageTitle },
  data() {
    return {
      selectedTopicId: 0,
      subjectOptions: []
    };
  },
  async mounted() {
    await Promise.all([
      this.getMyPerformances(0),
      this.allSubjects.length ? undefined : this.getAllSubjects()
    ]);
    this.subjectOptions = this.allSubjects.map(subject => ({
      value: subject.subjectId,
      label: subject.subjectName
    }));
    this.subjectOptions.unshift({ value: 0, label: "All Subjects" });
  },
  watch: {
    selectedTopicId(newVal) {
      this.getMyPerformances(newVal);
    }
  },
  methods: {
    ...mapActions({
      getMyPerformances: "performance/getMyPerformances",
      getAllSubjects: "subjects/getAllSubjects"
    })
  },
  computed: {
    ...mapState({
      myPerformances: state => state.performance.myPerformances,
      allSubjects: state => state.subjects.allSubjects
    }),
    series() {
      return [
        {
          name: "Number of correct answers",
          type: "column",
          data: this.myPerformances.map(m => m.correctAnswerCount)
        },
        {
          name: "Number of questions",
          type: "column",
          data: this.myPerformances.map(m => m.questionCount)
        },
        {
          name: "Correct percentage",
          type: "line",
          data: this.myPerformances.map(m =>
            ((m.correctAnswerCount / m.questionCount) * 100).toFixed(0)
          )
        }
      ];
    },
    chartOptions() {
      var options = {
        chart: {
          height: 350,
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
          categories: this.selectedTopicId
            ? this.myPerformances.map(m =>
                this.$moment(m.startTime).format("YYYY/MM/DD HH:mm:ss")
              )
            : this.myPerformances.map(
                m =>
                  this.allSubjects.find(s => s.subjectId == m.subjectId)
                    ?.subjectName
              ),
          tooltip: {
            enabled: this.selectedTopicId == 0 ? true : false,
            formatter: (val, opts) => {
              return this.$moment(
                this.myPerformances[opts.dataPointIndex].startTime
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