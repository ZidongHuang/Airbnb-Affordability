// JavaScript source code

// mapboxgl.accessToken = 'pk.eyJ1IjoiemRodWFuZyIsImEiOiJjazlwYXFlYjEwNXF5M2ltb3htaDQ2NGFiIn0.E7gXx-d4rRAyPOQ-yQlWaQ';
// var map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/zdhuang/ck9p9aa500sep1ip7rigtbb12',
//     center: [-73.987, 40.747],
//     zoom: 11
// });


// var setHeight = document.getElementById("set-height");
var vid = document.getElementById("pic");

var width = 700;
var height = 700;

var NYmapurl = 'https://raw.githubusercontent.com/payneli477/d3-NY-map-test/master/data/2010%20Census%20Tracts.geojson'

var svg = d3.select("div.main")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "black")
    .attr("transform", "translate(0,0)")
    .classed("map", true)

var svg2 = d3.select("div#map_afford")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "black")
    .attr("transform", "translate(0,0)")
    .classed("map", true)

var color = d3.scaleQuantize().domain([0, 100]).range(d3.schemeReds[9])
var color_cir = d3.scaleSequential(d3.interpolateBlues)

var albersProjection = d3.geoAlbers()
    .scale(250000)
    .rotate([73.987, 0])
    .center([0, 40.747])
    .translate([width / 2, height / 2])

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

    svg2.append("g").attr("transform", "translate(600,0)").selectAll("path")
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
