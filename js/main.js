// JavaScript source code

//------------------------------------This is the chart1-line-chart script (3 - ~100)------------------------------
var dataset = [[2008, 35], [2009, 458], [2010, 1558], [2011, 4513], [2012, 9868], [2013, 16337], [2014, 24814], [2015, 33779], [2016, 41145], [2017, 46456], [2018, 50960]]
var width = 650;
var height = 400;
var padding = { top: 80, right: 80, bottom: 80, left: 80 };

var xScale = d3.scaleLinear()
    .domain([new Date(2008), new Date(2018)])
    .range([0, width - padding.left - padding.right]);
var yScale = d3.scaleLinear()
    .domain([0, 55000])
    .range([height - padding.top - padding.bottom, 0]);

var svg = d3.select("div#chart1")
    .append('svg')
    .attr('width', width + 'px')
    .attr('height', height + 'px');

var xAxis = d3.axisBottom()
    .scale(xScale)
    .tickFormat(d3.format("d"))

var yAxis = d3.axisLeft()
    .scale(yScale);

svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(' + padding.left + ',' + (height - padding.bottom) + ')')
    .call(xAxis);
svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
    .call(yAxis);

svg.append("text")
    .attr("class", "titlestyling")
    .text("Airbnb Growth in NYC 2008-2018")
    .attr("text-anchor", "middle")
    .attr("x", "320")
    .attr("y", "50")
    .attr("fill", "#e43f5a")
    .attr("font", "Arial")
    .attr("font-size", 15);

svg.append("text")
    .text("Listing Count")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("x", "-140")
    .attr("y", "20")
    .attr("fill", "#e43f5a")
    .attr("font", "Arial")
    .attr("font-size", 14);

var linePath = d3.line()
    .x(function (d) { return xScale(d[0]) })
    .y(function (d) { return yScale(d[1]) });

svg.append('g')
    .append('path')
    .attr('class', 'line-path')
    .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
    .attr('d', linePath(dataset))
    .attr('fill', 'none')
    .attr('stroke-width', 2.5)
    .attr('stroke', 'white')
    .attr("opacity", .8)

var chart1_tooltip = d3.select("body").append("div").attr("class", "tooltip")
    .style("display", "none");

svg.append('g')
    .selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('r', 4)
    .attr("class", "cir")
    .attr('transform', function (d) {
        return 'translate(' + (xScale(d[0]) + padding.left) + ',' + (yScale(d[1]) + padding.top) + ')'
    })
    .attr('fill', 'white')
    .on("mouseover", function (d) {
        d3.select(this).transition().attr("r", 8)
        chart1_tooltip.style("display", "inline")
            .style("left", (d3.event.pageX - 40) + "px")
            .style("top", (d3.event.pageY - 40) + "px")
            .html("Year: " + String(d[0]) + "<br>" + "Airbnb Listings: " + String(d[1]))
    })
    .on("mouseout", function () {
        d3.select(this).transition().attr("r", 4)
        chart1_tooltip.style("display", "none")
    })
//------------------------------------------------------chart2--------------------------------------------------------------------
var svg = d3.select("div#matrix")
    .append("svg").attr("transform", "translate(100,0)")
    .attr("width", 600)
    .attr("height", 800);

var dot1 = [];
for (var i = 0; i < 20; i++) {
    var newNumber = i + 1;
    dot1.push(newNumber);
}

for (var row = 0; row < 8; row++) {
    for (var j = 0; j < 20; j++) {
        svg.append("circle")
        .attr("cx", function (d, i) {
            return (j * 20 + 30);
        })
        .attr("cy", function (d, i) {
            return (row * 20 + 80);
        })
        .attr("r", 7)
        .attr("class", "matrix_circle1")
    }
}

for (var j = 0; j < 7; j++) {
    svg.append("circle")
    .attr("cx", function (d, i) {
        return (j * 20 + 30);
    })
    .attr("cy", 240)
    .attr("r", 7)
    .attr("class", "matrix_circle1")
}

for (var j = 7; j < 20; j++) {
    svg.append("circle")
    .attr("cx", function (d, i) {
        return (j * 20 + 30);
    })
    .attr("cy", 240)
    .attr("r", 7)
    .attr("class", "matrix_circle2")
}

for (var row = 9; row < 20; row++) {
    for (var j = 0; j < 20; j++) {
        svg.append("circle")
        .attr("cx", function (d, i) {
            return (j * 20 + 30);
        })
        .attr("cy", function (d, i) {
            return (row * 20 + 80);
        })
        .attr("r", 7)
        .attr("class", "matrix_circle2")
    }
}

var controller = new ScrollMagic.Controller();

new ScrollMagic.Scene({ triggerElement: "#matrix_text_1" })
    .setClassToggle(".matrix_circle1", "active1")
    .addTo(controller);

new ScrollMagic.Scene({ triggerElement: "#matrix_text_1" })
    .setClassToggle(".matrix_circle2", "active1")
    .addTo(controller);

new ScrollMagic.Scene({ triggerElement: "#matrix_text_2" })
    .setClassToggle(".matrix_circle1", "active2")
    .addTo(controller);


//--------------------------------------------------------------------d3 map-------------------------------------------------------
// var setHeight = document.getElementById("set-height");
var vid = document.getElementById("pic");

var width = 700;
var h = 700;

var NYmapurl = 'https://raw.githubusercontent.com/payneli477/d3-NY-map-test/master/data/2010%20Census%20Tracts.geojson'

var svg = d3.select("div.main")
    .append("svg")
    .attr("width", width)
    .attr("height", h)
    .attr("fill", "black")
    .attr("transform", "translate(0,0)")
    .classed("map", true)

var svg2 = d3.select("div#map_afford")
    .append("svg")
    .attr("width", width)
    .attr("height", h)
    .attr("fill", "black")
    .attr("transform", "translate(0,0)")
    .classed("map", true)

var color = d3.scaleQuantize().domain([0, 100]).range(d3.schemeReds[9])
var color_cir = d3.scaleSequential(d3.interpolateBlues)

var albersProjection = d3.geoAlbers()
    .scale(250000)
    .rotate([73.987, 0])
    .center([0, 40.747])
    .translate([width / 2, h / 2])

var path = d3.geoPath()
    .projection(albersProjection)

//var map = Promise.all(promises).then(ready)
//var pt = [-73.987, 40.747];
//NYC-topojson-master/NTA.json
//topojson.feature(d, d.objects.collection).features

var afford_map = d3.map()
d3.csv("data/2018data_afford.csv", function (d) { afford_map.set(+d.Geo_TRACT, (+d.PCT_SE_A18002_004) + (+d.PCT_SE_A18002_005)) })
//console.log(afford_map)

var map = d3.json(NYmapurl).then(ready);

function ready(d) {
    //console.log(d.features[0].properties.ct2010)
    svg.append("g").attr("transform", "translate(600,0)").selectAll("path")
        .data(d.features)
        .enter()
        .append("path")
        .attr("fill", "black")
        .attr("opacity", .3)
        .style("stroke", "black")
        .attr("d", path)

    //svg.append("g").attr("transform", "translate(0,0)").selectAll("path")
    //    .data(d.features)
    //    .enter()
    //    .append("path")
    //    .attr("fill", function (d) {
    //        //console.log(afford_map.get(+d.properties.ct2010));
    //        return color(afford_map.get(+d.properties.ct2010))
    //        //return "white"
    //    })
    //    .attr("opacity", .5)
    //    .style("stroke", "white")
    //    .attr("d", path)

    d3.csv("/data/2018.3_airbnb_vacancy.csv").then(function (d) {
        svg.append("g").attr("transform", "translate(600,0)").selectAll("circle")
            .data(d)
            .enter()
            .append("circle")
            //.attr("class", "circle")
            .attr("opacity", .9)
            .attr("r", 2)
            .attr("cx", function (d) { return albersProjection([d.longitude, d.latitude])[0] })
            .attr("cy", function (d) { return albersProjection([d.longitude, d.latitude])[1] })
            .attr("fill", function (d) {
                //if (d.room_type == "Private room"){return "red"}
                //else if (d.room_type == "Shared room"){return "blue"}
                var vacancy = 1 - (+d.availability_365) / 365
                return color_cir(vacancy)
            })
        //.attr("stroke", "white")
        //.attr("z-index", 10)
    })

    d3.selectAll(".filter_circle").on("click", change)

    function change() {
        num = 0;
        id = this.id;
        text = this.textContent;
        console.log(text);
        console.log(id)
        d3.csv("/data/2018.3_airbnb_vacancy.csv").then(function (d) {
            svg.selectAll("circle").data(d).transition()
                .attr("opacity", function (d) {
                    b = (+d.availability_365 / 365) <= +id + 0.2 && +d.availability_365 / 365 >= +id;
                    if (b) { num += 1; return 1 }
                    else { return 0 }
                })
                .duration(2000)

            document.getElementById("num").innerHTML = num;
            document.getElementById("vacancy_rate").innerHTML = text;
        })
    }

    //-------------------------------------map2----------------------------------------------
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("display", "none");

    var div_l1 = div.append("p").style("line-height", "5px");
    var div_l2 = div.append("p").style("line-height", "5px");

    svg2.append("g").attr("transform", "translate(600,0)").style("z-index", "1").selectAll("path")
        .data(d.features)
        .enter()
        .append("path")
        .attr("fill", function (d) {
            //console.log(afford_map.get(+d.properties.ct2010));
            return color(afford_map.get(+d.properties.ct2010))

            //return "white"
        })
        .attr("opacity", .6)
        .style("stroke", "#1b1b2f")
        .style("stroke-width", .5)
        .attr("d", path)
        .on("mouseover", mouseover)
        .on("mousemove", function (d) {
            div
                .text(function () {
                    p = afford_map.get(+d.properties.ct2010);
                    if (p >= 0.66) { return "Hard to Afford" + "(" + Math.round(p)+ "%)"; }
                    else if (p >= 0.33) { return "Affordable" + "(" + Math.round(p) + "%)"; }
                    else { return "Easy to Afford" + "(" + Math.round(p) + "%)"; }
                })
                .style("left", (d3.event.pageX - 34) + "px")
                .style("top", (d3.event.pageY - 12) + "px");
        })
        .on("mouseout", mouseout);

    function mouseover() {
        if (+d3.select(this).attr("opacity") < 0.1) { div.style("display", "none"); }
        else { div.style("display", "inline"); }
    }

    function mousemove(d, div) {
        div
            .text(function (d) {
                p = afford_map.get(+d.properties.ct2010);
                return "Affordability: " + p;
            })
            .style("left", (d3.event.pageX - 34) + "px")
            .style("top", (d3.event.pageY - 12) + "px");
    }

    function mouseout() {
        div.style("display", "none");
    }


    var scale_rect = d3.scaleLinear().domain([0,100]).range([0, 500]);
    var g = d3.select("#legend").append("svg").attr("class", "legend").attr("transform", "translate(0,0)").append("g");
        //svg2.append("g").attr("class", "key").attr("transform", "translate(0,70)");

    g.selectAll("rect")
        .data(color.range().map(function (d) { console.log(color.invertExtent(d)); return color.invertExtent(d) }))
        .enter().append("rect")
        .attr("height", 20)
        .attr("x", d => scale_rect(d[0]))
        .attr("width", function (d) { return scale_rect(d[1]) - scale_rect(d[0]); })
        .attr("fill", function (d) { return color(d[0]); })

    //g.append("text")
    //    //.attr("class", "caption")
    //    .attr("x", scale_rect.range()[0])
    //    .attr("y", 0)
    //    .attr("fill", "white")
    //    .attr("text-anchor", "start")
    //    .attr("font-weight", "bold")
    //    .text("Unemployment rate");

    var l = ["0%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%"];
    g.selectAll("text").data(l).enter().append("text")
        .attr("x", function (d, i) { return scale_rect(i * 10) })
        .attr("y", 30)
        .attr("fill", "white")
        .style("font-size", "10px")
        .text(d=>d)

    //g.call(d3.axisBottom(scale_rect)
    //    .tickSize(20)
    //    .tickFormat(function (x, i) { return i ? x : x + "%"; })
    //    .tickValues(color.domain()))
    //    .select(".domain")
    //    .remove();

    d3.selectAll(".filter_path").on("click", change_path)

    function change_path() {
        id = this.id;
        svg2.selectAll("path")
            .data(d.features)
            .transition()
            .attr("opacity", function (d) {
                if (id == "all") {return 0.6}
                per_num = afford_map.get(+d.properties.ct2010);
                if (per_num > +id && per_num <= +id + 33) { return .6 }
                else { return 0 }
            })
            .duration(2000)
    }
}
