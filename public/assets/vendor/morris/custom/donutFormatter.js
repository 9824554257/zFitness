Morris.Donut({
  element: "donutFormatter",
  data: [
    { value: 155, label: "voo", formatted: "at least 70%" },
    { value: 12, label: "bar", formatted: "approx. 15%" },
    { value: 10, label: "baz", formatted: "approx. 10%" },
    { value: 5, label: "A really really long label", formatted: "at most 5%" },
  ],
  resize: true,
  hideHover: "auto",
  formatter: function (x, data) {
    return data.formatted;
  },
  labelColor: "#594323",
  colors: [
    "#4D65DD",
    "#5E74E0",
    "#6F83E4",
    "#8092E7",
    "#91A0EA",
    "#A2AFEE",
    "#B3BEF1",
  ],
});
