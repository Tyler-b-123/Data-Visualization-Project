function stuff(data){
    console.log(data);
    makeChart(data, "#chart-id", 1);
    makeChart(data, "#chart-id2", 0);
    
    function makeChart(data, divId, flag){
    //this is all just a prof of concept to see how it works not finalized at all
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

    var svg = d3.select(divId)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    if (flag === 1){
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueLine)
        .attr("stroke", "orange")
        .attr("stroke-width", 2)
        .attr("fill", "#FFFFFF");
    }

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
        //need below for axis in the future with decimal points and very small differences like birdie conversion left blank for now 
        svg.append("g")
            .call(d3.axisLeft(y).tickFormat(function (d){
                return d3.format("") (d)
            }));
    }
}

d3.json("https://raw.githubusercontent.com/Tyler-b-123/Data-Visualization-Project/master/playerStats.json").then(stuff);