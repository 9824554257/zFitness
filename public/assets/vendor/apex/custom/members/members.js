var options = {
  series: [
    {
      type: 'rangeArea',
      name: 'Male',

      data: [
        {
          x: 'Jan',
          y: [11, 19]
        },
        {
          x: 'Feb',
          y: [12, 18]
        },
        {
          x: 'Mar',
          y: [9, 29]
        },
        {
          x: 'Apr',
          y: [14, 27]
        },
        {
          x: 'May',
          y: [26, 39]
        },
        {
          x: 'Jun',
          y: [5, 17]
        },
        {
          x: 'Jul',
          y: [19, 23]
        },
        {
          x: 'Aug',
          y: [10, 15]
        }
      ]
    },

    {
      type: 'rangeArea',
      name: 'Female',
      data: [
        {
          x: 'Jan',
          y: [31, 34]
        },
        {
          x: 'Feb',
          y: [42, 52]
        },
        {
          x: 'Mar',
          y: [39, 49]
        },
        {
          x: 'Apr',
          y: [34, 39]
        },
        {
          x: 'May',
          y: [51, 59]
        },
        {
          x: 'Jun',
          y: [54, 67]
        },
        {
          x: 'Jul',
          y: [43, 46]
        },
        {
          x: 'Aug',
          y: [21, 29]
        }
      ]
    },

    {
      type: 'line',
      name: 'Male',
      data: [
        {
          x: 'Jan',
          y: 15
        },
        {
          x: 'Feb',
          y: 17
        },
        {
          x: 'Mar',
          y: 19
        },
        {
          x: 'Apr',
          y: 22
        },
        {
          x: 'May',
          y: 30
        },
        {
          x: 'Jun',
          y: 10
        },
        {
          x: 'Jul',
          y: 21
        },
        {
          x: 'Aug',
          y: 12
        },
        {
          x: 'Sep',
          y: 18
        },
        {
          x: 'Oct',
          y: 20
        },
        {
          x: 'Nov',
          y: 22
        },
        {
          x: 'Dec',
          y: 32
        }
      ]
    },
    {
      type: 'line',
      name: 'Female',
      data: [
        {
          x: 'Jan',
          y: 33
        },
        {
          x: 'Feb',
          y: 49
        },
        {
          x: 'Mar',
          y: 43
        },
        {
          x: 'Apr',
          y: 37
        },
        {
          x: 'May',
          y: 55
        },
        {
          x: 'Jun',
          y: 59
        },
        {
          x: 'Jul',
          y: 45
        },
        {
          x: 'Aug',
          y: 24
        },
        {
          x: 'Sep',
          y: 21
        },
        {
          x: 'Oct',
          y: 15
        },
        {
          x: 'Nov',
          y: 17
        },
        {
          x: 'Dec',
          y: 12
        }
      ]
    }
  ],
  chart: {
    height: 300,
    type: 'rangeArea',
    animations: {
      speed: 500
    },
    toolbar: {
      show: false,
    },
  },
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
      left: 20,
    },
  },
  colors: ['#6479e7', '#ff7ec9'],
  dataLabels: {
    enabled: false
  },
  fill: {
    opacity: [0.24, 0.24, 1, 1]
  },
  forecastDataPoints: {
    count: 2
  },
  stroke: {
    curve: 'smooth',
    width: [0, 0, 3, 3]
  },
  legend: {
    show: true,
    customLegendItems: ['Male', 'Female'],
    inverseOrder: true
  },
  markers: {
    hover: {
      sizeOffset: 5
    }
  }
};

var chart = new ApexCharts(document.querySelector("#members"), options);
chart.render();