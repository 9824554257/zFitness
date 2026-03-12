// Chart 1
var options1 = {
  chart: {
    height: 90,
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
    width: 5,
  },
  series: [
    {
      name: "Sleep",
      data: [7, 8, 7, 8, 7, 8, 7],
    },
  ],
  grid: {
    show: false,
  },
  xaxis: {
    categories: ["S", "M", "T", "W", "T", "F", "S"],
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  colors: ["#ff4967", "#9196a2", "#66a4ff"],
  markers: {
    show: false,
  },
};
var chart1 = new ApexCharts(document.querySelector("#sleep"), options1);
chart1.render();