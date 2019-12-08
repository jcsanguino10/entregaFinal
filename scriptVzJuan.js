d3.csv("https://raw.githubusercontent.com/jcsanguino10/VisualAnalytics/master/DatosFIltrados.csv")
    .then((data) => {
        let dataT = data
        let dat = []
        dataT.forEach((d) => {
            if (d.semestre != 201920 && d.curso == "ISIS 1204") {
                var newDat = {
                    'id': d.id,
                    'semestre': d.semestre,
                    'nota_español': d.leng1501,
                    'nota_apo': d.definitiva_banner,
                    'retiro_banner': d.retiro_banner
                };
                if (d.leng1501 == 0) {
                    newDat.nota_español = d.lite1611;
                }
                if (newDat.nota_español != 0) {
                    dat.push(newDat);
                }
            }
        })
        var datosCompletos = dat
        var datosFinal = []
        calcularCluster()
        var margin = { top: 10, right: 0, bottom: 50, left: 45 },
            width = 500 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var svg2 = d3.select("#viz_juan2")
            .append("svg")
            .attr("width", width + margin.left + margin.right + 100)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // append the svg object to the body of the page
        var svg = d3.select("#viz_juan")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
        var myGroups = d3.map(datosFinal, function (d) { return d.español; }).keys()
        var myVars = d3.map(datosFinal, function (d) { return d.apo; }).keys()

        //let data2 = dataT.filter(d => d.TRIMESTRE === varTrim);

        // Build X scales and axis:
        var x = d3.scaleBand()
            .range([0, width])
            .domain(d3.set(datosFinal.map(d => d.español)).values())
            .padding(0.05);

        svg.append("g")
            .style("font-size", 12)
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(0))
            .select(".domain").remove()

        // Build Y scales and axis:
        var y = d3.scaleBand()
            .range([height, 0])
            .domain(d3.set(datosFinal.map(d => d.apo)).values())
            .padding(0.05);
        const x1 = d3.scaleLinear()
            .domain([0, d3.max(dat, d => d["nota_español"])])
            .range([0, width])
            .nice();

        const y1 = d3.scaleLinear()
            .domain([0, d3.max(dat, d => d["nota_apo"])])
            .range([height, 0])
            .nice();
        svg.append("g")
            .style("font-size", 12)
            .call(d3.axisLeft(y).tickSize(0))
            .select(".domain").remove()

        // Build color scale
        var myColor = d3.scaleSequential()
            .interpolator(d3.interpolateOranges)
            .domain([1, 100])


        // create a tooltip
        var tooltip = d3.select("#viz_juan")
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
                .html("El numero de estudiantes es: " + d.estudiantes)
                .style("left", (d3.mouse(this)[0] + 70) + "px")
                .style("top", (d3.mouse(this)[1]) + "px");
        }
        var mouseleave = function (d) {
            tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 0.8)
        }

        // add the squares
        pintarCeldas()

        // X axis label:  
        svg.append("text")
            .style("color", "red")
            .attr("text-anchor", "end")
            .attr("x", width - 300)
            .attr("y", height + 35)
            .text("Nota español");

        // Y axis label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 15)
            .attr("x", -height / 2)
            .text("Notas APO");

        d3.select("#selectButton").on("change", function () {
            dat = datosCompletos
            var selectedOption = d3.select(this).property("value")
            if (selectedOption === "1") {
                dat = dat.filter(d => d)
                calcularCluster()
                limpiar()
                pintarCeldas()
            }

            else if (selectedOption === "2") {
                dat = dat.filter(d => {
                    if (d.retiro_banner == 1) {
                        return d;
                    }
                })
                calcularCluster()
                limpiar()
                pintarCeldas()
            }

            else if (selectedOption === "3") {
                dat = dat.filter(d => {
                    if (d.retiro_banner == 0) {
                        return d;
                    }
                })
                calcularCluster()
                limpiar()
                pintarCeldas()
            }
        });
        function calcularCluster() {
            var cotaInicial = 0
            var cotFinal = 0.5
            datosFinal = []
            while (cotFinal <= 5) {
                var notaApo = 0;
                while (notaApo <= 5) {
                    datosFinal.push(grupo(cotaInicial, cotFinal, notaApo, dat))
                    notaApo += 0.5
                }
                cotaInicial += 0.5
                cotFinal += 0.5
            }
            return datosFinal;
        }
        function limpiar() {
            svg.selectAll("rect").remove()
            svg2.selectAll("circle").remove()
        }

        function pintarCeldas() {
            svg.selectAll()
                .data(datosFinal)
                .enter()
                .append("rect")
                .attr("x", d => x(d.español))
                .attr("y", d => y(d.apo))
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("width", x.bandwidth())
                .attr("height", y.bandwidth())
                .style("fill", function (d) {
                    if (d.estudiantes == 0) { return "white" } else { return myColor(d.estudiantes) }
                })
                .style("stroke-width", 4)
                .style("stroke", "none")
                .style("opacity", 0.8)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave);
            svg2.selectAll()
                .data(dat)
                .enter()
                .append("circle")
                .attr("cx", d => x1(d["nota_español"]))
                .attr("cy", d => y1(d["nota_apo"]))
                .attr("r", 5)
                .style("opacity", 0.1)
                .style("fill", "#E67E22");
        }

        svg2.append("g")
            .call(d3.axisBottom(x1))
            .attr("transform", "translate(0, " + height + ")");

        svg2.append("g")
            .call(d3.axisLeft(y1));

        svg2.selectAll()
            .data(dat)
            .enter()
            .append("circle")
            .attr("cx", d => x1(d["nota_español"]))
            .attr("cy", d => y1(d["nota_apo"]))
            .attr("r", 5)
            .style("opacity", 0.1)
            .style("fill", "#E67E22");
    });


function grupo(a, b, c, datos) {
    if (a != 0) {
        a = a + 0.1
    }
    var resp = {
        "español": "(" + a + "-" + b + ")",
        "apo": c,
        "estudiantes": 0
    }
    datos.forEach((d) => {
        var espa = d.nota_español;
        var apo = d.nota_apo
        if (espa >= a && espa <= (b) && apo == c) {
            resp.estudiantes++
        }
    })
    return resp
}