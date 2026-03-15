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
      name: "Heartbeat",
      data: [75, 80, 75, 80, 75, 80, 75],
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
  colors: ["#6479e7", "#9196a2", "#66a4ff"],
  markers: {
    show: false,
  },
};
var chart1 = new ApexCharts(document.querySelector("#heartbeat"), options1);
chart1.render();