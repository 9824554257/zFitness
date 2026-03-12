var options = {
  chart: {
    height: 160,
    width: 210,
    type: "bar",
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      columnWidth: "14",
      borderRadius: 5,
      distributed: true,
      dataLabels: {
        position: "center",
      },
    },
  },
  series: [
    {
      name: "Running",
      data: [5, 6, 7, 8, 9, 10, 9],
    },
  ],
  legend: {
    show: false,
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
    axisBorder: {
      show: false,
    },
    labels: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
  grid: {
    borderColor: "#d8dee6",
    strokeDashArray: 5,
    xaxis: {
      lines: {
        show: false,
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
  tooltip: {
    y: {
      formatter: function (val) {
        return val + "hrs";
      },
    },
  },
  colors: [
    "#7486e9"
  ],
};
var chart = new ApexCharts(document.querySelector("#runningWeekly"), options);
chart.render();