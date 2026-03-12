var options = {
  series: [40, 50, 60, 70, 80],
  chart: {
    height: 240,
    type: "radialBar",
  },
  plotOptions: {
    radialBar: {
      dataLabels: {
        name: {
          fontSize: "22px",
        },
        value: {
          fontSize: "16px",
        },
        total: {
          show: true,
          label: "Total",
          formatter: function (w) {
            // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
            return 249;
          },
        },
      },
    },
  },
  labels: ["Samsung", "Apple", "Nokia", "Motorola", "Huawei"],
  colors: [
    "#4D65DD",
    "#5E74E0",
    "#6F83E4",
    "#8092E7",
    "#91A0EA",
    "#A2AFEE",
    "#B3BEF1",
  ],
};

var chart = new ApexCharts(document.querySelector("#radial"), options);
chart.render();
