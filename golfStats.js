//Tyler Buoy
//CSCI 490/680 Final Project

//setting up the size of the graph for the first part
var margin = {top: 100, right: 20, bottom: 30, left:40},
width = 800 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

//setting up the scale
var x = d3.scaleLinear()
        .range([0, width]);
    
var y = d3.scaleLinear()
        .range([height, 0]);

//selecting the html div for the scatter plot to go
var svg = d3.select("#chart-id")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select("body").append("div")
    .attr("class", "tooltip-hover")
    .style("opacity", 0);

//calling createChart which will make the chart and set the default comparison to Yds/Drive
createChart();
function createChart(){
    d3.json("https://raw.githubusercontent.com/Tyler-b-123/Data-Visualization-Project/master/playerStats.json").then(stuff);
function stuff(data){
    console.log(data);
   
   
   var personOne = null;
   var personTwo = null;
   var chartTitle = "Average Yards per Drive";

    plotPoints(285, "Yds/Drive");

    function plotPoints(offset, comparison){

        x.domain(d3.extent(data, function(d) {
            return d["position"];
        }));
            
        y.domain([offset, d3.max(data, function (d){
            return d[comparison];
        })]);


    var path = svg.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", function (d){
            return x(d["position"]);
        })
        .attr("cy", function (d){
            return y(d[comparison]);
        })
        .attr("fill", "black")
        .style('opacity', .4)
        //mouse overs so that you know which dot you are about to press
        .on('mouseover', function (d,i){
            d3.select(this).transition()
                .duration('10')
                .style('opacity', 1);
            div.transition()
                .duration('50')
                .style("opacity", 1);
            div.html(d["Name"])
                .style("left", (d3.event.pageX + 1) + "px")
                .style("right", (d3.event.pageY + 1) + "px");

        })
        .on('mouseout', function (d,i){
            d3.select(this).transition()
                .duration('10')
                .style('opacity', .4);
            div.transition()
                .duration('50')
                .style("opacity", 0);
        })
        //the click function will add players to variables to be compared and change the point to orage to indicate it has
        //already been chosen also has error checking to make sure only 2 players are added.
        .on('click', function (d,i){
            if (personOne === null){
                d3.select(this).transition()
                    .duration('10')
                    .style('opacity', 1)
                    .style('fill', 'orange');
                personOne = d;
                console.log(personOne);
                alert(d["Name"] + " added as first person for comparison.");
            }
            else if (personOne != null && personTwo === null){
                d3.select(this).transition()
                    .duration('10')
                    .style('opacity', 1)
                    .style('fill', 'red');
                personTwo = d;
                console.log(personTwo);
                alert(d["Name"] + " added as second person for comparison.");
            }
            else{
                alert("You have already selected the maximum amount of players to be compared.");
            }
        });
       
        svg.append("text")
            .attr("class", "p title")
            .attr("x", (width + (margin.left + margin.right))/2)
            .attr("y", -150 + margin.top)
            .attr("text-anchor", "middle")
            .attr("font-size", "30px")
            .attr("font-family", "sans-serif")
            .text(chartTitle);
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y).tickFormat(function (d){
                return d3.format("") (d)
            }));

        //trendline

        var xSeries = d3.range(1, 51);
        var ySeries = data.map(function(d) {return parseFloat(d[comparison]); });

        var leastSquaresCoeff = leastSquares(xSeries, ySeries);

        var x1 = 1;
        var y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
        var x2 = 50;
        var y2 = leastSquaresCoeff[0] * 50 + leastSquaresCoeff[1];
        var trendData = [[x1,y1,x2,y2]];

        createTrendline(trendData);

        }

}
}

function updatePoints(){
    d3.json("https://raw.githubusercontent.com/Tyler-b-123/Data-Visualization-Project/master/playerStats.json").then(update);
function update(data){
    console.log(data);
    
    var chartType = document.getElementById('selectForm').value;
    console.log(chartType);

    var chartTitle = null;
   
    if (chartType === "Yds/Drive"){
       // alert("You have chosen Yds/Drive");
        chartTitle = "Average Yards per Drive";
        updateGraph(285, "Yds/Drive");
    }
    if (chartType === "drivingAcc"){
      //  alert("You have chosen drivingAcc");
        chartTitle = "Driver Accuracy";
        updateGraph(50, "drivingAcc");
    }
    if (chartType === "putts/Hole"){
       //alert("You have chosen putts/Hole");
        chartTitle = "Average Putts per Hole";
       updateGraph(1.68, "putts/Hole");
    }
    if (chartType === "birdies"){
       // alert("You have chosen birdies");
        chartTitle = "Total Birdies";
        updateGraph(100, "birdies");
    }
    if (chartType === "birdieConv"){
      //  alert("You have chosen the birdie conversion rate");
        chartTitle = "Birdie Conversion Rate %";
        updateGraph(25, "birdieConv");
    }
    if (chartType === "avgScore"){
      //  alert("You have chosen the average score");
        chartTitle = "Average Score";
        updateGraph(68.5, "avgScore");
    }
    if (chartType === "avgFinish"){
      //  alert("You have chosen the average finish");
        chartTitle = "Average Finish";
        updateGraph(15, "avgFinish");
    }

function updateGraph(offset, comparison){


    x.domain(d3.extent(data, function(d) {
        return d["position"];
    }));
        
    y.domain([offset, d3.max(data, function (d){
        return d[comparison];
    })]);


    svg.selectAll("circle")
        .data(data)
        .transition()
        .duration(1000)
        .attr("cx", function (d){
            return x(d["position"]);
        })
        .attr("cy", function (d){
            return y(d[comparison]);
        });
    
    svg.select(".p.title")
        .transition()
        .duration(1000)
        .text(chartTitle);

    svg.select(".x.axis")
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x));

    svg.select(".y.axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y).tickFormat(function (d){
            return d3.format("") (d)
        }));

    var xSeries = d3.range(1, 51);
    var ySeries = data.map(function (d) { return parseFloat(d[comparison]); });

    var leastSquaresCoeff = leastSquares(xSeries, ySeries);

    var x1 = 1;
    var y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
    var x2 = 50;
    var y2 = leastSquaresCoeff[0] * 50 + leastSquaresCoeff[1];
    var trendData = [[x1, y1, x2, y2]];

    modifyTrendLine(trendData);
    }
}
}

function createTrendline(trendData){
    var trendline = svg.selectAll(".trendline")
            .data(trendData);

    trendline.enter()
        .append("line")
        .attr("class", "trendline")
        .attr("x1", function (d){ return x(d[0]); })
        .attr("y1", function (d){ return y(d[1]); })
        .attr("x2", function (d){ return x(d[2]); })
        .attr("y2", function (d){ return y(d[3]); })
        .attr("stroke", "black")
        .attr("stroke-width", 1);
}

function modifyTrendLine(trendData){
    svg.selectAll(".trendline")
        .data(trendData)
        .transition()
        .duration(1000)
        .attr("x1", function (d){ return x(d[0]); })
        .attr("y1", function (d){ return y(d[1]); })
        .attr("x2", function (d){ return x(d[2]); })
        .attr("y2", function (d){ return y(d[3]); });
}


//article where i got the formula http://bl.ocks.org/benvandyke/8459843
function leastSquares(xSeries, ySeries) {
    var reduceSumFunc = function(prev, cur) { return prev + cur; };
        
    var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
    var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

    var ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
        .reduce(reduceSumFunc);
        
    var ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
        .reduce(reduceSumFunc);
            
    var ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar); })
        .reduce(reduceSumFunc);
            
    var slope = ssXY / ssXX;
    var intercept = yBar - (xBar * slope);
    var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);
        
    return [slope, intercept, rSquare];
}
