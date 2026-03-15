var options = {
  chart: {
    height: 160,
    width: 210,
    type: "line",
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    width: 4,
  },
  series: [
    {
      name: "Gym",
      data: [5, 3, 5, 8, 7, 9, 5],
    }
  ],
  grid: {
    borderColor: "#d8dee6",
    strokeDashArray: 5,
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: false,
      },
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  },
  xaxis: {
    categories: [
      "S",
      "M",
      "T",
      "W",
      "T",
      "F",
      "S",
    ],
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  colors: ["#ff395a"],
  tooltip: {
    y: {
      formatter: function (val) {
        return val + "hrs";
      },
    },
  },
};

var chart = new ApexCharts(document.querySelector("#gymWeekly"), options);

chart.render();