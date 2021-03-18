<template>
  <div>
    <page-title title="Performance" />
    <div>
      Select topic
      <br />
      <a-select
        style="min-width: 120px"
        class="mb-2"
        v-model="selectedTopic"
        :options="subjectOptions"
      />
    </div>
    <div class="chart-title">Performance Over Time</div>
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
      correctAnswers: [14, 13, 15, 24, 23, 12, 17, 24],
      totalQuestions: [20, 20, 20, 30, 30, 20, 20, 30],
      selectedTopic: 0,
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
    this.subjectOptions.unshift({ value: 0, label: "All" });
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
          name: "Percentage",
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
          width: [1, 1, 4]
        },
        plotOptions: {
          bar: {
            columnWidth: "20%"
          }
        },
        xaxis: {
          categories: this.myPerformances.map(m =>
            this.$moment(m.startTime).format("YYYY/MM/DD HH:mm:ss")
          )
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
            seriesName: "Percentage",
            axisTicks: {
              show: true
            },
            axisBorder: {
              show: true
            },
            title: {
              text: "Percentage"
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
          }
        },
        legend: {
          horizontalAlign: "left",
          offsetX: 40
        }
      };
      return options;
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