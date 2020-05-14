// chart 3
var inputValue = null;
var years = [2015, 2016,2017, 2018]

 // append the svg object to the body of the page
    // set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 60, left: 50},
// var chartDiv = document.getElementById("pic3");
width = 600 - margin.left - margin.right,
height = 300 - margin.top - margin.bottom;
var Svg = d3.select("div#chart3")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            // .style("border-color", "black")
            // .style("border-style", "solid")
            // .style("border-width", "0.1px")
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/vacancy_and_365.csv").then(function(data){

    var data_year = data.filter(function(d){return d.year == 2018})
    draw_chart3(data_year)

    d3.select("#timeslide").on("input", function(){
        console.log(this.value);
        update(+this.value);
    })

    function update(value){
        document.getElementById("range").innerHTML=years[value];
        inputValue = years[value];
        console.log(inputValue)
        var data_year = data.filter(function(d){return d.year == inputValue})
        draw_chart3(data_year)
    }

})


function draw_chart3(data){

    //using slider to filter data_year
        //reference: https://bl.ocks.org/officeofjane/9b9e606e9876e34385cc4aeab188ed73

    // var data_year = data.filter(function(d){return d.year == 2018})

    data_year = data

    // var data_year = data.filter(function(d){return d.year == 2018})

    console.log("year out", data_year)


    //using data_year
    console.log("Data", data_year)



    //max

    var max_vacancy_r = 100,
        max_365 = 370;



    // Add X axis
    var x = d3.scaleLinear()
            .nice()
            .domain([0, max_365] )
            .range([ 0, width]);

    Svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

    Svg.append("g")
            .append("text")
            .attr('id', 'label3')
            .attr("text-anchor", "middle")
            .attr("font-size","14px")
            .attr("x", width - 30)
            .attr("y", height + 30)
            .attr("fill", "white")
            .text("Availability days")

    // Add Y axis
    var y = d3.scaleLinear()
            .nice()
            .domain([0, max_vacancy_r])
            .range([ height, 0 ]);
    Svg.append("g")
        .call(d3.axisLeft(y));


    Svg.append("g")
        .append("text")
        .attr('id', 'label3')
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("font-size","14px")
        .attr("x", 0 - 40)
        .attr("y", 0 - (margin.left/2 + 10))
        .attr("fill", "white")
        .text("Vacancy Rate")

    // Reformat the data: d3.rectbin() needs a specific format

    var inputForRectBinning = []
    data_year.forEach(function(d) {
        inputForRectBinning.push( [+d.availability_365, +d.vacancy_r] )  // Note that we had the transform value of X and Y !
    })

    console.log("INPUT", inputForRectBinning)

    // Compute the rectbin

    var size = 10

    var rectbinData = d3.rectbin()
                        .dx(size)
                        .dy(size)
        (inputForRectBinning);
    console.log("Rectbindata", rectbinData)

    // Prepare a color palette

    var datamax = d3.max(rectbinData, function(d){ return +d.length});

    var col_div1 = 300
    var col_div2 = 800

    var domain = [0, datamax]
    var domain1 = [1, col_div1]
    var domain2 = [col_div1, col_div2]
    var color_range2 = ['#E43F5A', '#BA0F2C']
    var color_range1 = ['#F9E8EC','#E43F5A']

    var color1 = d3.scaleLinear()
    .domain(domain1)
    .range(color_range1);

    var color2 = d3.scaleLinear()
    .domain(domain2)
    .range(color_range2);
    // var color = d3.scaleSequential().domain(domain)
    //                     .interpolator(d3.interpolatePuRd);

    // What is the height of a square in px?
    var heightInPx = y(max_vacancy_r-size)
    var widthInPx = x(0+size)

    //add the sqares

    Svg.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    Svg.append("g")
        .attr("clip-path", "url(#clip)")
        .selectAll("myRect")
        .data(rectbinData)
        .enter().append("rect")
            .attr("x", function(d) { return x(d.x) })
            .attr("y", function(d) { return y(d.y) - heightInPx })
            .attr("width", widthInPx )
            .attr("height", heightInPx )
            .attr("fill", function(d) {
                if(d.length == 0){ return "white"}
                else if(d.length>0 && d.length < col_div1){return color1(d.length);}
                else if(d.length > col_div2){return '#640616'}
                else{return color2(d.length); }
            })
            .attr("stroke", "black")
            .attr("stroke-width", "0.1")
            .on("mouseover", function(d){
                //   d3.select(this).attr("fill-opacity","0.5");
                  d3.select(this).attr('stroke', 'black').attr('stroke-width', 5);

                // d3.select(this).attr("fill-opacity","0.5");
                d3.select('h2#chart3_des').text( d.length + ' units');
              })
              .on("mouseout", function(d){
                d3.select(this).attr('stroke-width',0.1);
                d3.select('h2#chart3_des').text( 'Hover to view number of units in each grid');
                })







}


 //////////////others



    // var ymin = d3.min(rows, function(d){ return +d[yLabel]});
    // var ymax = d3.max(rows, function(d){ return +d[yLabel]});






    // // Build X scales and axis:
    // var x = d3.scaleBand()
    //             .range([ 0, width ])
    //             .domain(myGroups)
    //             .padding(0.01);
    // svg.append("g")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(d3.axisBottom(x))

    // // Build Y scales and axis:
    // var y = d3.scaleBand()
    //         .range([ height, 0 ])
    //         .domain(myVars)
    //         .padding(0.01);
    // svg.append("g")
    //     .call(d3.axisLeft(y));

    // // Build color scale
    // var myColor = d3.scaleLinear()
    //                 .range(["white", "#69b3a2"])
    //                 .domain([1,100])
    //  // add the squares
    // svg.selectAll()
    //     .data(data, function(d) {return d.group+':'+d.variable;})
    //     .enter()
    //     .append("rect")
    //         .attr("x", function(d) { return x(d.vacancy_r) })
    //         .attr("y", function(d) { return y(d.availability_365) })
    //         .attr("width", x.bandwidth() )
    //         .attr("height", y.bandwidth() )
    //         .style("fill", function(d) { return myColor(d.value)} )





    /*

    class_div = [0, 90, 180, 270]

    var data_class4 = data_year.filter(function(d){return d.availability_365 > class_div[3]})
    var data_class3 = data_year.filter(function(d){return d.availability_365 <class_div[3] && d.availability_365 > class_div[2]})
    var data_class2 = data_year.filter(function(d){return d.availability_365 <class_div[2] && d.availability_365 > class_div[1]})
    var data_class1 = data_year.filter(function(d){return d.availability_365 <class_div[1] && d.availability_365 >0})   //lots of 0???


    var data_test = data_year.filter(function(d){return d.number_of_reviews/d.availability_365 > 0.6})
    console.log("data.test", data_test)

    chart3_description = [
        'Less than' + class_div[1] + ' days',
        class_div[1] + "~" + class_div[2] +' days',
        class_div[2] + "~" + class_div[3] + ' days',
        'More than' + class_div[3] + ' days'
    ]

    var nest_class1 = d3.nest()
                // .key(d => d.availability_365)
                .rollup(values => values.length)
                .entries(data_class1);

    var nest_class2 = d3.nest()
                // .key(d => d.availability_365)
                .rollup(values => values.length)
                .entries(data_class2);
    var nest_class3 = d3.nest()
                // .key(d => d.availability_365)
                .rollup(values => values.length)
                .entries(data_class3);

    var nest_class4 = d3.nest()
                // .key(d => d.availability_365)
                .rollup(values => values.length)
                .entries(data_class4);

    console.log("nest 1", nest_class1)
    console.log("nest 2", nest_class2)
    console.log("nest 3", nest_class3)
    console.log("nest 4", nest_class4)

    var count_list = [nest_class1, nest_class2, nest_class3, nest_class4]

    var count_sum = d3.sum(count_list)
    console.log(count_list)
    console.log(count_sum)

    var count_ratio = [nest_class1/count_sum, nest_class2/count_sum, nest_class3/count_sum, nest_class4/count_sum]
    console.log("Ratio", count_ratio)

    console.log("max", Math.min(...count_ratio),Math.max(...count_ratio))

    //color

    var blues = d3.scaleOrdinal(d3.schemeBlues[9]);

    var chart3_color = d3.scaleSequential().domain([Math.min(...count_ratio)-0.2,Math.max(...count_ratio)])
    .interpolator(d3.interpolateRdPu);
    //d3.scaleLinear()
    //     .domain([Math.min(...count_ratio), Math.max(...count_ratio)])
    //     .range(["white", "red"]);
        // .range(["#ffffcc", "#e31a1c"]);

    console.log("color", chart3_color(count_ratio[0]))


    var chart3data = [{level: 'up', ratio: nest_class1/(nest_class1+nest_class2), color: chart3_color(count_ratio[0]), unit: nest_class1, r: count_ratio[0], des: chart3_description[0]},
                    {level: 'up', ratio: nest_class2/(nest_class1+nest_class2), color: chart3_color(count_ratio[1]), unit: nest_class2, r: count_ratio[1], des: chart3_description[1]},
                    {level: 'low', ratio: nest_class3/(nest_class3+nest_class4), color: chart3_color(count_ratio[2]), unit: nest_class3, r: count_ratio[2], des: chart3_description[2]},
                    {level: 'low', ratio: nest_class4/(nest_class3+nest_class4), color: chart3_color(count_ratio[3]), unit: nest_class4, r: count_ratio[3], des: chart3_description[3]}];

    var upper_ratio_sum = count_ratio[0]+count_ratio[1];
    var lower_ratio_sum = count_ratio[2]+count_ratio[3];
    console.log(upper_ratio_sum)
    console.log(lower_ratio_sum)


    var chart3_w = 500;
    var chart3_h = 400;

    var svgContainer = d3.select("div#chart3")
                .append("svg")
                .attr("width", chart3_w)
                .attr("height", chart3_h)
                .style("border-color", "black")
                .style("border-style", "solid")
                .style("border-width", "1px");




    var chart3_bar = svgContainer.selectAll("rect#rj")
                .data(chart3data)
                // .data(data.filter(function(d){return d.availability_365 == year;}))
                .enter()
                .append("rect")
                .attr("x", function(d,i){
                    if(i>0 && i!=2){console.log("x", chart3data [i-1].ratio);return chart3_w * parseFloat(chart3data [i-1].ratio);}
                    else{console.log("x0", 0); return 0;}
                })
                .attr("y", function(d,i){
                    if(d.level == 'up'){return 0;}
                    else{return chart3_h * (1 - lower_ratio_sum)}
                    })
                .attr("width", d => chart3_w * (d.ratio))
                .attr("height", function(d){
                    if(d.level =='up'){return chart3_h * upper_ratio_sum;}
                    else{ return chart3_h * lower_ratio_sum;}
                })
                .attr("fill", d => d.color)
                .attr("id", "rj")
                .on("mouseover", function(d){
                    d3.select(this).attr("stroke", "black").attr("stroke-width", 5);
                    d3.select("h2").text((d.r).toFixed(2));
                    d3.select("text#chart3_text2").attr("class","clart3_text_selected");
                    // d3.select(this).attr("class", "incident hover");
                })
                .on("mouseout", function(d){    //without mousout the value won't change after the mouseout
                    d3.select(this).attr("stroke", "black").attr("stroke-width", 0);
                    d3.select("h2").text("");
                    // d3.select(this).attr("class", "incident");
                });

    chart3_text1 = svgContainer.selectAll("text#chart3_text")
                .data(chart3data)
                .enter()
                .append("text")
                .text(function(d) {
                     return d.des
                })
                .attr("id", "text#chart3_text")
                .attr("text-anchor", "top")
                .attr("x", function(d,i){
                    if(i>0 && i!=2){console.log("x", chart3data [i-1].ratio);return chart3_w * parseFloat(chart3data [i-1].ratio)+10;}
                    else{console.log("x0", 0); return 10;}
                })
                .attr("y", function(d,i){
                    if(d.level == 'up'){return 30;}
                    else{return chart3_h * (1 - lower_ratio_sum)+30}
                    })
                .attr("class","chart3_text1_o")
                .attr("font-family", "sans-serif")
                .attr("font-size", "13px")
                .attr("fill", "white")
                //.attr("opacity", .8)


    chart3_text2 = svgContainer.selectAll("text#chart3_text_2")
                .data(chart3data)
                .enter()
                .append("text")
                .text(function(d) {
                    return 'Ratio: '+ ((d.r) * 100).toFixed(2) + "%"
               })
                .attr("id", "text#chart3_text_2")
                .attr("text-anchor", "top")
                .attr("x", function(d,i){
                    if(i>0 && i!=2){console.log("x", chart3data [i-1].ratio);return chart3_w * parseFloat(chart3data [i-1].ratio)+10;}
                    else{console.log("x0", 0); return 10;}
                })
                .attr("y", function(d,i){
                    if(d.level == 'up'){return 50;}
                    else{return chart3_h * (1 - lower_ratio_sum)+50}
                    })
                .attr("font-family", "sans-serif")
                .attr("font-size", "13px")
                .attr("fill", "white")
                .attr("class","chart3_text2_o");

    chart3_text3 = svgContainer.selectAll("text#chart3_text_3")
                .data(chart3data)
                .enter()
                .append("text")
                .text(function(d) {
                     return 'Units: '+ (d.unit)
                })
                .attr("id", "text#chart3_text_3")
                .attr("text-anchor", "top")
                .attr("x", function(d,i){
                    if(i>0 && i!=2){console.log("x", chart3data [i-1].ratio);return chart3_w * parseFloat(chart3data [i-1].ratio)+10;}
                    else{console.log("x0", 0); return 10;}
                })
                .attr("y", function(d,i){
                    if(d.level == 'up'){return 70;}
                    else{return chart3_h * (1 - lower_ratio_sum)+70}
                    })
                .attr("font-family", "sans-serif")
                .attr("font-size", "13px")
                .attr("fill", "white")
                .attr("class","chart3_text2_o");
                */
