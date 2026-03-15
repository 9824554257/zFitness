var options = {
  chart: {
    height: 300,
    type: "bar",
    stacked: true,
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 5,
    colors: ["transparent"],
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "30%",
      endingShape: "flat",
      borderRadius: 8,
      borderRadiusApplication: "around",
      borderRadiusWhenStacked: "around",
    },
  },
  series: [
    {
      name: "This Year",
      data: [44, 55, 41, 67, 22, 43, 21, 49, 60, 56, 48, 30],
    },
    {
      name: "Last Year",
      data: [13, 23, 20, 8, 13, 27, 33, 12, 20, 24, 48, 15],
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
  fill: {
    opacity: [1, 0.5],
    colors: ["#6479e7", "#a8b3bb", "#436ccf", "#dcad10", "#828382"],
  },
  colors: ["#6479e7", "#a8b3bb", "#436ccf", "#dcad10", "#828382"],
  tooltip: {
    y: {
      formatter: function (val) {
        return "$" + val + "k";
      },
    },
  },
};

var chart = new ApexCharts(document.querySelector("#income"), options);

chart.render();
