var options = {
  series: [
    {
      name: "Tickets",
      data: [200, 330, 548, 740, 880, 1100],
    },
  ],
  chart: {
    type: "bar",
    height: 300,
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      borderRadius: 0,
      horizontal: true,
      distributed: true,
      barHeight: "80%",
      isFunnel: true,
    },
  },
  colors: [
    "#4D65DD",
    "#5E74E0",
    "#6F83E4",
    "#8092E7",
    "#91A0EA",
    "#A2AFEE",
    "#B3BEF1",
  ],
  dataLabels: {
    enabled: true,
    formatter: function (val, opt) {
      return opt.w.globals.labels[opt.dataPointIndex];
    },
    dropShadow: {
      enabled: true,
    },
  },
  xaxis: {
    categories: ["Closed", "Hold", "Resolved", "In Progress", "Open", "Total"],
  },
  legend: {
    show: true,
  },
};

var chart = new ApexCharts(document.querySelector("#pyramid"), options);
chart.render();
