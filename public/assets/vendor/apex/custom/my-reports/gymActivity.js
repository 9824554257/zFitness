var options = {
  chart: {
    height: 320,
    type: "area",
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  plotOptions: {
    bar: {
      columnWidth: "30%",
      borderRadius: 5,
    },
  },
  series: [
    {
      name: "Gym",
      type: "column",
      data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 50, 20],
    },
    {
      name: "Yoga",
      type: "area",
      data: [2, 4, 6, 8, 10, 20, 30, 40, 50, 60, 70, 80],
    },
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
      bottom: 10,
      left: 0,
    },
  },
  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  colors: ["#9196a2", "#6479e7", "#66a4ff"],
  markers: {
    size: 0,
    opacity: 0.3,
    colors: ["#9196a2", "#6479e7", "#66a4ff"],
    strokeColor: "#ffffff",
    strokeWidth: 2,
    hover: {
      size: 7,
    },
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + " " + "hours";
      },
    },
  },
};

var chart = new ApexCharts(document.querySelector("#gymActivity"), options);

chart.render();