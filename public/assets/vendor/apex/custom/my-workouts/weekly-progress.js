var options = {
  chart: {
    height: 150,
    type: 'bar',
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '50%',
      distributed: true,
      borderRadius: 10,
    },
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 10,
    colors: ['rgba(0, 0, 0, .05)']
  },
  series: [{
    name: 'Progress',
    data: [20, 40, 80, 90, 60, 80, 0]
  }],
  legend: {
    show: false,
  },
  xaxis: {
    categories: ['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat'],
  },
  yaxis: {
    show: false,
  },
  fill: {
    colors: ["#6479e7", "#0eace0", "#06c2c0", "#eed130", "#ff4967"],
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return + val + '%'
      }
    }
  },
  grid: {
    show: false,
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: false,
      }
    },
    padding: {
      top: 0,
      right: 0,
      bottom: -10,
      left: 0
    },
  },
  colors: ['#ffffff'],
}
var chart = new ApexCharts(
  document.querySelector("#weekly-progress"),
  options
);
chart.render();