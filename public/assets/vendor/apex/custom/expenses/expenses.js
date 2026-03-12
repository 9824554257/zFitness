var options = {
  chart: {
    height: 300,
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
    width: 5,
  },
  series: [
    {
      name: "Expenses",
      data: [30, 40, 30, 50, 40, 50, 40, 90, 70, 100, 120, 90],
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
        show: true,
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
  colors: ["#6479e7", "#ce313e", "#436ccf", "#dcad10", "#828382"],
  markers: {
    size: 0,
    opacity: 0.3,
    colors: ["#6479e7", "#ce313e", "#436ccf", "#dcad10", "#828382"],
    strokeColor: "#ffffff",
    strokeWidth: 1,
    hover: {
      size: 7,
    },
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return "$" + val + "k";
      },
    },
  },
};

var chart = new ApexCharts(document.querySelector("#expenses"), options);

chart.render();
