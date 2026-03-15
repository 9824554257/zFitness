// Morris Donut
Morris.Donut({
  element: "donutColors",
  data: [
    { value: 30, label: "foo" },
    { value: 15, label: "bar" },
    { value: 10, label: "baz" },
    { value: 5, label: "A really really long label" },
  ],
  backgroundColor: "#17181c",
  labelColor: "#17181c",
  colors: [
    "#4D65DD",
    "#5E74E0",
    "#6F83E4",
    "#8092E7",
    "#91A0EA",
    "#A2AFEE",
    "#B3BEF1",
  ],
  resize: true,
  hideHover: "auto",
  gridLineColor: "#dfd6ff",
  formatter: function (x) {
    return x + "%";
  },
});
