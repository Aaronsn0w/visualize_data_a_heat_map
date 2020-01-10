const URL =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

const svgW = 1080;
const svgH = 600;
const padding = 60;

const body = d3
  .select("body")
  .attr("class", "container")
  .append("h1")
  .text("Monthly Global Land-Surface Temperature")
  .attr("id", "title")
  .attr("class", "mt-5");

//creando tooltip
body
  .append("span")
  .attr("id", "tooltip")
  .style("display", "none")
  .style("position", "absolute");

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgW)
  .attr("height", svgH);

fetch(URL)
  .then(res => res.json())
  .then(json => {
    const tmpBase = json["baseTemperature"];
    const dataset = json["monthlyVariance"];

    //agregando descripcion
    body
      .append("h3")
      .attr("id", "description")
      .text(
        `${dataset[0]["year"]} - ${
          dataset[dataset.length - 1]["year"]
        }: base temperature ${tmpBase} °C`
      );

    //creando escalas y ejes
    //escala eje x
    const xMax = d3.max(dataset, d => d["year"]);
    const xMin = d3.min(dataset, d => d["year"]);
    const xScale = d3
      .scaleLinear()
      .domain([xMin, xMax])
      .range([padding, svgW - padding]);
    //axis
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format(4));

    //escala eje y
    const months = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

    const yScale = d3
      .scaleBand()
      .domain(months)
      .range([svgH - (padding + 50), padding - 50]);
    //creando axis
    const yAxis = d3.axisLeft(yScale).tickFormat(d => numToMes(d));

    //creando axis
    svg
      .append("g")
      .attr("transform", "translate(0," + (svgH - (padding + 50)) + ")")
      .attr("id", "x-axis")
      .call(xAxis);

    svg
      .append("g")
      .attr("transform", "translate(" + padding + ",0)")
      .attr("id", "y-axis")
      .call(yAxis);

    //crear grupo para leyenda
    const legend = svg
      .append("g")
      .attr("id", "legend")
      .attr("transform", `translate(${svgW / 3},${svgH - 60})`);
    //definir parametros de colores y valores
    const tempScale = [2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8];
    const colors = [
      "#313695",
      "#4575b4",
      "#74add1",
      "#abd9e9",
      "#e0f3f8",
      "#ffffbf",
      "#fee090",
      "#fdae61",
      "#f46d43",
      "#d73027",
      "#a50026"
    ];
    //crear escala de colores
    const colorScale = d3
      .scaleThreshold()
      .domain(tempScale)
      .range(colors);
    //dibujar la leyenda
    const legSize = 30;
    legend
      .selectAll("rect")
      .data(tempScale)
      .enter()
      .append("rect")
      .attr("fill", d => colorScale(d))
      .attr("width", legSize)
      .attr("height", legSize)
      .attr("x", (d, i) => i * legSize);
    legend
      .selectAll("text")
      .data(tempScale)
      .enter()
      .append("text")
      .attr("y", legSize + 15)
      .attr("x", (d, i) => i * legSize)
      .text(d => d3.format(".1f")(d));
    //
    //definir constantes de apoyo para el tamaño de los rect
    const barWidth = (svgW * 4) / xScale(xMax);
    const barHeight = (svgH - (padding + 50)) / 12;
    //crear rect y posicionar segun sus valores correspondientes
    svg
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .style("fill", (d, i) => colorScale(d["variance"] + tmpBase))
      .attr("data-month", d => d["month"] - 1)
      .attr("data-year", d => d["year"])
      .attr("data-temp", d => d["variance"] + tmpBase)
      .attr("y", d => yScale(d["month"]))
      .attr("x", d => xScale(d["year"]))
      .attr("width", barWidth)
      .attr("height", barHeight)
      .on("mouseover", function(d, i) {
        let temp = d["variance"] + tmpBase;
        $("#tooltip").show();
        d3.select("#tooltip")
          .attr("data-year", d["year"])
          .style("left", d3.event.x + 5 + "px")
          .style("top", d3.event.y + 5 + "px")
          .html(
            `${numToMes(d["month"])}, ${d["year"]} <br> ${temp.toFixed(
              3
            )}°C <br> ${d["variance"]}°C`
          );
      })
      .on("mouseout", function() {
        $("#tooltip").hide();
      });
    //agregando by
    d3.select("body")
      .append("footer")
      .append("a")
      .text("By EmilioRT")
      .attr("href", "https:emiliort.com")
      .attr("target", "_blank")
      .attr("class", "text-decoration-none");
  });

function numToMes(num) {
  switch (num) {
    case 1:
      return "January";
    case 2:
      return "February";
    case 3:
      return "March";
    case 4:
      return "April";
    case 5:
      return "May";
    case 6:
      return "June";
    case 7:
      return "July";
    case 8:
      return "August";
    case 9:
      return "September";
    case 10:
      return "October";
    case 11:
      return "November";
    case 12:
      return "December";
  }
}
