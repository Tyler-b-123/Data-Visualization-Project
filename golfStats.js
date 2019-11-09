
function stuff(data){
    console.log(data);
    var tbody = document.getElementById("tbody");
    for (var i = 0; i < data.length; i++) {
	    var tr = "<tr>";
        tr += "<td>" + data[i]["Name"] + "&nbsp &nbsp &nbsp &nbsp" + "</td>" + "<td>" + data[i]["position"].toString() + "&nbsp &nbsp &nbsp &nbsp" + "</td>" +
        "<td>" + data[i]["Yds/Drive"].toString() + "</td>" + "</tr>";
 	    tbody.innerHTML += tr;
    }
    
    //this is all just a prof of concept to see how it works not finalized at all may change the size aswell
    var margin = {top: 20, right: 20, bottom: 30, left:40},
        width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    /*
    adding the axis for the data, this will be me just trying out doing player rank and yds/drive 
    just to see how it looks will prob use a select tag or something to chose what you are going to see
    also may play around with the color and do something like have it make the dot a diff color based on players rank
    like have it be 1-10 are blue and etc.
    */
    var x = d3.scaleLinear()
        .range([0, width]);
    
    var y = d3.scaleLinear()
        .range([height, 0]);

    x.domain(d3.extent(data, function(d) {
        return d["position"];
    }));

    y.domain([285, d3.max(data, function (d){
        return d["Yds/Drive"];
    })]);

    var valueLine = d3.line()
        .x(function (d){
            return x(d["position"]);
        })
        .y(function (d){
            return y(d["Yds/Drive"]);
        });

    //adding the data points x will be the players rank and y will be there average driving distance
    //may add a hover to the dots to display the players name
    //may also add like a trend line or something to this

    var svg = d3.select("#chart-id")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var path = svg.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", function (d){
            console.log("x cordinate");
            console.log(x(d["position"]));
            return x(d["position"]);
        })
        .attr("cy", function (d){
            console.log("y cordinate");
            console.log(y(d["Yds/Drive"]));
            return y(d["Yds/Drive"]);
        })
        .attr("fill", "red");

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        svg.append("g")
            .call(d3.axisLeft(y).tickFormat(function (d){
                return d3.format("") (d)
            }));

}

d3.json("https://raw.githubusercontent.com/Tyler-b-123/Data-Visualization-Project/master/playerStats.json").then(stuff);