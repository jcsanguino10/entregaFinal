

//Read the data
d3.csv("https://gist.githubusercontent.com/ValentinaChaconBuitrago/f77a909d5da26da984b522056d871799/raw/8a09631305aa68f92ec146a6d388fcc1769909b3/trial.csv", function (data) {

    // set the dimensions and margins of the graph
    var margin = { top: 80, right: 25, bottom: 60, left: 70 },
        width = 1250 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
    var myGroups = d3.map(data, function (d) { return d.saber_matematicas; }).keys()
    var myVars = d3.map(data, function (d) { return d.definitiva_banner; }).keys()

    // Build X scales and axis:

    let valores = data.map(d => d.saber_matematicas).sort((a, b) => a - b)

    // Build X scales and axis:
    var x = d3.scaleBand()
        .range([0, width])
        .domain(myGroups)
        .padding(0.05);
    svg.append("g")
        .style("font-size", 15)
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(0))

    let valor = data.map(d => d.definitiva_banner).sort((a, b) => a - b)
    // Build Y scales and axis:
    var y = d3.scaleBand()
        .range([height, 0])
        .domain(valor)
        .padding(0.05);
    svg.append("g")
        .style("font-size", 15)
        .call(d3.axisLeft(y).tickSize(0))


    // Build color scale
    var myColor = d3.scaleSequential()
        .interpolator(d3.interpolateGreens)
        .domain([1, 100])

    // create a tooltip
    var tooltip = d3.select("#my_dataviz")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function (d) {
        tooltip
            .style("opacity", 1)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
    }
    var mousemove = function (d) {
        tooltip
            .html("El número de estudiantes es: " + d.size)
            .style("left", (d3.mouse(this)[0] + 70) + "px")
            .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseleave = function (d) {
        tooltip
            .style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8)
    }

    // add the squares
    svg.selectAll()
        .data(data, function (d) { return d.saber_matematicas + ':' + d.definitiva_banner; })
        .enter()
        .append("rect")
        .attr("x", function (d) { return x(d.saber_matematicas) })
        .attr("y", function (d) { return y(d.definitiva_banner) })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", function (d) { return myColor(d.size) })
        .style("stroke-width", 4)
        .style("stroke", "none")
        .style("opacity", 0.8)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    // Add title to graph
    svg.append("text")
        .attr("x", 0)
        .attr("y", -50)
        .attr("text-anchor", "left")
        .style("font-size", "22px")
        .text("Resultados de matemáticas en el icfes y nota final en APO");

    // Add subtitle to graph
    svg.append("text")
        .attr("x", 0)
        .attr("y", -20)
        .attr("text-anchor", "left")
        .style("font-size", "14px")
        .style("fill", "grey")
        .style("max-width", 400)
        .text("Los estudiantes que son considerados exitosos son aquellos que lográn pasar la materia de APO. Para esto se requiere más de 3.0 en la calificación final.");

    // X axis label:  
    svg.append("text")
        .style("color", "red")
        .attr("text-anchor", "end")
        .attr("x", width - 470)
        .attr("y", height + 29)
        .text("Puntaje en Matemáticas");

    // Y axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 30)
        .attr("x", -height / 2 + 40)
        .text("Nota final en APO")
})
