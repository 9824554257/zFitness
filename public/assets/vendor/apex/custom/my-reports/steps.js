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
      name: "Steps",
      data: [7500, 8000, 7500, 8000, 7500, 8000, 7500],
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
  colors: ["#06c2c0", "#9196a2", "#66a4ff"],
  markers: {
    show: false,
  },
};
var chart1 = new ApexCharts(document.querySelector("#steps"), options1);
chart1.render();