//Tyler Buoy
//CSCI 490/680 Final Project

//setting up the size of the graph for the first part
var margin = {top: 100, right: 40, bottom: 30, left:40},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

//setting up the scale
var x = d3.scaleLinear()
        .range([0, width]);
    
var y = d3.scaleLinear()
        .range([height, 0]);

var y2 = d3.scaleLinear()
        .range([height, 0]);

//selecting the html div for the scatter plot to go
var svg = d3.select("#chart-id")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg2 = d3.select("#chart-id2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//used for comparing the 2 seleted players driver statistics
var drivingSvg = d3.select(".driverComp")
    .append("svg");

//used for comparing the 2 selected players birdie stats
var birdieSvg = d3.select(".birdieComp")
    .append("svg");

//used for comparing the 2 selected players putting stats
var puttsSvg = d3.select(".puttsComp")
    .append("svg");

//used for comparing the 2 selected players score stats
var scoreSvg = d3.select(".scoreComp")
    .append("svg");

//this is a tooltip used for showing the players name on :hover
var div = d3.select("body").append("div")
    .attr("class", "tooltip-hover")
    .style("opacity", 0);

//the below 4 vars are used to show the selected players names as well as display a legend for the color
//that represents the player in the visulization
var person1Txt = d3.select(".person1");
var person1Legend = d3.select(".person1Legend")
    .append("svg");
var person2Txt = d3.select(".person2");
var person2Legend = d3.select(".person2Legend")
    .append("svg");

//the below 4 vars are used to show the titles for the bars
var driverDistLabel = d3.select(".driverDistTitle");
var birdiePerLabel = d3.select(".birdiePerTitle");
var puttsAvgLabel = d3.select(".puttsAvgTitle");
var scoreAvgLabel = d3.select(".scoreAvgTitle");

//the below 8 vars are used to show the data that makes up the bars
var driverTxt1 = d3.select(".driverTxt1");
var driverTxt2 = d3.select(".driverTxt2");
var birdiesTxt1 = d3.select(".birdiesTxt1");
var birdiesTxt2 = d3.select(".birdiesTxt2");
var puttsTxt1 = d3.select(".puttsTxt1");
var puttsTxt2 = d3.select(".puttsTxt2");
var scoreTxt1 = d3.select(".scoreTxt1");
var scoreTxt2 = d3.select(".scoreTxt2");

//the personOne var is passed the object of the first person to be used in the second visualization
var personOne = null;
//the personTwo var is passed the object of the second person to be used in the second visualization
var personTwo = null;
//used for the first visualization to know which type of graph to draw
var comparison = null;

//calling createChart which will make the chart and set the default comparison to Yds/Drive
createChart();
//making the comparison and just defaulting everything to 0 to modity it with transitions
createComparison();
function createChart(){
    d3.json("https://raw.githubusercontent.com/Tyler-b-123/Data-Visualization-Project/master/playerStats.json").then(stuff);
function stuff(data){
    console.log(data);
   
   var chartTitle = "Average Yards per Drive";

    comparison = "Yds/Drive";
    plotPoints(285, comparison);

    function plotPoints(offset, comparison){

        //below 2 are used to get the position of the points for the scatter plot
        x.domain(d3.extent(data, function(d) {
            return d["position"];
        }));
            
        y.domain([offset, d3.max(data, function (d){
            return d[comparison];
        })]);

    //is used to draw the dots
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
        //this also handels the displaying of the name on hover
        .on('mouseover', function (d,i){
            d3.select(this).transition()
                .duration('10')
                .style('opacity', 1);
            div.transition()
                .duration('50')
                .style("opacity", 1);
            div.html(d["Name"])
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 15) + "px");

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
                personOne = d;
                console.log(personOne);
                //alert(d["Name"] + " added as first person for comparison.");
            }
            else if (personOne != null && personTwo === null){
                personTwo = d;
                console.log(personTwo);
                //know's that 2 players are selected so it will call the function to modify the second
                //visualization based on the selected players stats
                modifyComparison();
                //alert(d["Name"] + " added as second person for comparison.");
            }
            else{
                alert("You have already selected the maximum amount of players to be compared.");
            }
        });
       
        //this is used to make thie title of the graph makes it chartTitle which is a var that will store
        //the title based on what the user selected from the html form
        svg.append("text")
            .attr("class", "p title")
            .attr("x", (width + (margin.left + margin.right))/2)
            .attr("y", -150 + margin.top)
            .attr("text-anchor", "middle")
            .attr("font-size", "30px")
            .attr("font-family", "sans-serif")
            .text(chartTitle);
        //this is the x axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        //this is the y axis
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
        createChartSecond(offset, comparison);
        }

        function createChartSecond(offset, comparison){

            x.domain(d3.extent(data, function(d) {
                return d["position"];
            }));
            
            y.domain([50, d3.max(data, function (d){
                return d["drivingAcc"];
            })]);
    
            var path = svg2.selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("cx", function (d){
                return x(d["position"]);
            })
            .attr("cy", function (d){
                return y(d["drivingAcc"]);
            })
            .attr("fill", "green")
            .style('opacity', .4)
            //mouse overs so that you know which dot you are about to press
            //this also handels the displaying of the name on hover
            .on('mouseover', function (d,i){
                d3.select(this).transition()
                    .duration('10')
                    .style('opacity', 1);
                div.transition()
                    .duration('50')
                    .style("opacity", 1);
                div.html(d["Name"])
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY - 15) + "px");
    
            })
            .on('mouseout', function (d,i){
                d3.select(this).transition()
                    .duration('10')
                    .style('opacity', .4);
                div.transition()
                    .duration('50')
                    .style("opacity", 0);
            });
    
            svg2.append("g")
                .attr("class", "y2 axis")
                .attr("transform", "translate( " + width + ", 0 )")
                .call(d3.axisRight(y).tickFormat(function (d){
                    return d3.format("") (d)
                }));

                var xSeries = d3.range(1, 51);
                var ySeries = data.map(function(d) {return parseFloat(d["drivingAcc"]); });
        
                var leastSquaresCoeff = leastSquares(xSeries, ySeries);
        
                var x1 = 1;
                var y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
                var x2 = 50;
                var y2 = leastSquaresCoeff[0] * 50 + leastSquaresCoeff[1];
                var trendData2 = [[x1,y1,x2,y2]];
        
                createTrendLine2(trendData2);
    
        }

}
    
}

//this function will update the graph used for the first visualization called by onclick in the html
function updatePoints(){
    d3.json("https://raw.githubusercontent.com/Tyler-b-123/Data-Visualization-Project/master/playerStats.json").then(update);
function update(data){
    console.log(data);
    
    //getting the selected comparison from the html form
    var chartType = document.getElementById('selectForm').value;
    console.log(chartType);

    var chartTitle = null;
   
    //block of if statments to create the correct graph based on the comparison type selected by the user
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

//the offset is the lowest point on the graph used as to not waste space on the bottom
function updateGraph(offset, comparison){

    x.domain(d3.extent(data, function(d) {
        return d["position"];
    }));
        
    y.domain([offset, d3.max(data, function (d){
        return d[comparison];
    })]);

    //changing the graph to the new graph using transition's
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
    
    //updating the title
    svg.select(".p.title")
        .transition()
        .duration(1000)
        .text(chartTitle);

    //updating the x axis
    svg.select(".x.axis")
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x));

    //updating the y axis
    svg.select(".y.axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y).tickFormat(function (d){
            return d3.format("") (d)
        }));

    //updating the tredline
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

function updatePoints2(){
    d3.json("https://raw.githubusercontent.com/Tyler-b-123/Data-Visualization-Project/master/playerStats.json").then(update);
function update(data){
    console.log(data);
    
    //getting the selected comparison from the html form
    var chartType = document.getElementById('selectForm2').value;
    console.log(chartType);

    //block of if statments to create the correct graph based on the comparison type selected by the user
    if (chartType === "Nothing"){
        updateGraph(0,0);
    }
    if (chartType === "Yds/Drive2"){
       // alert("You have chosen Yds/Drive");
        updateGraph(285, "Yds/Drive");
    }
    if (chartType === "drivingAcc2"){
      //  alert("You have chosen drivingAcc");
        updateGraph(50, "drivingAcc");
    }
    if (chartType === "putts/Hole2"){
       //alert("You have chosen putts/Hole");
       updateGraph(1.68, "putts/Hole");
    }
    if (chartType === "birdies2"){
       // alert("You have chosen birdies");
        updateGraph(100, "birdies");
    }
    if (chartType === "birdieConv2"){
      //  alert("You have chosen the birdie conversion rate");
        updateGraph(25, "birdieConv");
    }
    if (chartType === "avgScore2"){
      //  alert("You have chosen the average score");
        updateGraph(68.5, "avgScore");
    }
    if (chartType === "avgFinish2"){
      //  alert("You have chosen the average finish");
        updateGraph(15, "avgFinish");
    }

//the offset is the lowest point on the graph used as to not waste space on the bottom
function updateGraph(offset, comparison){

    if (offset === 0 && comparison === 0){
        svg2.selectAll("circle")
        .data(data)
        .transition()
        .duration(1000)
        .attr("cx", function (d){
            return (0);
        })
        .attr("cy", function (d){
            return (0);
        })
        .style("fill", "white");

        svg2.selectAll(".trendline2")
        .transition()
        .duration(1000)
        .style("fill", "white")
        .style("opacity", "0");
    }
    else{
    x.domain(d3.extent(data, function(d) {
        return d["position"];
    }));
        
    y.domain([offset, d3.max(data, function (d){
        return d[comparison];
    })]);

    //changing the graph to the new graph using transition's
    svg2.selectAll("circle")
        .data(data)
        .transition()
        .duration(1000)
        .attr("cx", function (d){
            return x(d["position"]);
        })
        .attr("cy", function (d){
            return y(d[comparison]);
        })
        .style("fill", "green");

    //updating the y axis
    svg2.select(".y2.axis")
        .transition()
        .duration(1000)
        .call(d3.axisRight(y).tickFormat(function (d){
            return d3.format("") (d)
        }));

    //updating the tredline
    var xSeries = d3.range(1, 51);
    var ySeries = data.map(function (d) { return parseFloat(d[comparison]); });

    var leastSquaresCoeff = leastSquares(xSeries, ySeries);

    var x1 = 1;
    var y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
    var x2 = 50;
    var y2 = leastSquaresCoeff[0] * 50 + leastSquaresCoeff[1];
    var trendData2 = [[x1, y1, x2, y2]];

    modifyTrendLine2(trendData2);
    }
}
}
}

//creates the trend line
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
function createTrendLine2(trendData2){
    var trendline = svg2.selectAll(".trendline2")
            .data(trendData2);

    trendline.enter()
        .append("line")
        .attr("class", "trendline2")
        .attr("x1", function (d){ return x(d[0]); })
        .attr("y1", function (d){ return y(d[1]); })
        .attr("x2", function (d){ return x(d[2]); })
        .attr("y2", function (d){ return y(d[3]); })
        .attr("stroke", "green")
        .attr("stroke-width", 1);
}

//updates the tredline
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

function modifyTrendLine2(trendData2){
    svg2.selectAll(".trendline2")
        .data(trendData2)
        .transition()
        .duration(1000)
        .attr("x1", function (d){ return x(d[0]); })
        .attr("y1", function (d){ return y(d[1]); })
        .attr("x2", function (d){ return x(d[2]); })
        .attr("y2", function (d){ return y(d[3]); })
        .style("opacity", "1");
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

//this function will create the comparison for the second visualization
function createComparison(){
    //making the driver distance and accuracy bar
    //more length = farther drive
    //more width = more accuracy
    drivingSvg.selectAll("rect")
        .data([personOne, personTwo])
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", function(d,i) {return i * 80})
        .attr("width", 0)
        .attr("height", 0)
        .attr("fill", function(d,i){
            if (i === 0){
                return "orange";
            }
            if (i === 1){
                return "red";
            }
        })
        .style("stroke", "black")
        .style("stroke-width", "2");
    
    //setting up the txt so that it can be modified later
    driverTxt1.append("text")
        .text("");
    driverTxt2.append("text")
        .text("");

    //setting up the bars for the birdie comparison so that it can be modified later
    birdieSvg.selectAll("rect")
        .data([personOne, personTwo])
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", function(d,i) {return i * 30})
        .attr("width", 0)
        .attr("height", 30)
        .attr("fill", function(d,i){
            if (i === 0){
                return "orange";
            }
            if (i === 1){
                return "red";
            }
        })
        .style("stroke", "black")
        .style("stroke-width", "2");

    birdiesTxt1.append("text")
        .text("");
    birdiesTxt2.append("text")
        .text("");

    //setting up the putts comparison so that it can be modified later
    puttsSvg.selectAll("rect")
        .data([personOne, personTwo])
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", function(d,i) {return i * 30})
        .attr("width", 0)
        .attr("height", 30)
        .attr("fill", function(d,i){
            if (i === 0){
                return "orange";
            }
            if (i === 1){
                return "red";
            }
        })
        .style("stroke", "black")
        .style("stroke-width", "2");

    puttsTxt1.append("text")
        .text("");
    puttsTxt2.append("text")
        .text("");

    //setting up the score comparison so that it can be modified later
    scoreSvg.selectAll("rect")
        .data([personOne, personTwo])
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", function(d,i) {return i * 30})
        .attr("width", 0)
        .attr("height", 30)
        .attr("fill", function(d,i){
            if (i === 0){
                return "orange";
            }
            if (i === 1){
                return "red";
            }
        })
        .style("stroke", "black")
        .style("stroke-width", "2");

    scoreTxt1.append("text")
        .text("");
    scoreTxt2.append("text")
        .text("");
    
    person1Txt.append("text")
        .text("No player Selected");
    person2Txt.append("text")
        .text("No player Selected");

    driverDistLabel.append("text")
        .style("font-family", "sans-serif")
        .style("color", "white")
        .style("font-size", "1rem");
    birdiePerLabel.append("text")
        .style("font-family", "sans-serif")
        .style("color", "white")
        .style("font-size", "1rem");
    puttsAvgLabel.append("text")
        .style("font-family", "sans-serif")
        .style("color", "white")
        .style("font-size", "1rem");
    scoreAvgLabel.append("text")
        .style("font-family", "sans-serif")
        .style("color", "white")
        .style("font-size", "1rem");
    
}

//this function is used to modify the second visualization called when there are 2 players selected using the onclick d3 function
//in the first visualization 
function modifyComparison(){
    //error checking to make sure that 2 players are selected
    if (personOne === null){
        alert("You have zero players selected please select 2 players to use the comparison function.");
    }
    else if(personOne != null && personTwo === null){
        alert("You have only selected 1 player please select another player to use the comparison function.");
    }
    else{
        //updates the avg driver dist and acc for the 2 players selected and then modifies the svg bars
        drivingSvg.selectAll("rect")
            .data([personOne, personTwo])
            .transition()
            .duration(1000)
            .attr("width", function(d,i){
                return ((d["Yds/Drive"] / 319.8) * 250);
            })
            .attr("height", function(d,i){
                return ((d["drivingAcc"] / 74.8) * 40);
            });
        //makes it display the title of that part
        driverDistLabel.selectAll("text")
            .transition()
            .duration(1000)
            .text("Driver Distance & Accuracy");

        //displays the dist on the bars for the coresponding player
        driverTxt1.selectAll("text")
            .transition()
            .duration(1000)
            .text(personOne["Yds/Drive"] + " YDS");

        driverTxt2.selectAll("text")
            .transition()
            .duration(1000)
            .text(personTwo["Yds/Drive"] + " YDS");
        
        //modifys the birdie comparison
        birdieSvg.selectAll("rect")
            .data([personOne, personTwo])
            .transition()
            .duration(1000)
            .attr("width", function(d,i){
                return ((d["birdieConv"] / 38.8) * 100)
            });
        
        //modifys the title
        birdiePerLabel.selectAll("text")
            .transition()
            .duration(1000)
            .text("% Birdie Conv");

        //modifies birdie% txt value
        birdiesTxt1.selectAll("text")
            .transition()
            .duration(1000)
            .text(personOne["birdieConv"] + "%");

        birdiesTxt2.selectAll("text")
            .transition()
            .duration(1000)
            .text(personTwo["birdieConv"] + "%");

        //modifies the putts comparison
        puttsSvg.selectAll("rect")
            .data([personOne, personTwo])
            .transition()
            .duration(1000)
            .attr("width", function(d,i){
                return ((d["putts/Hole"] / 1.81) * 100)
            });
        
        //title
        puttsAvgLabel.selectAll("text")
            .transition()
            .duration(1000)
            .text("Avg Putts");

        //modifies the avg putts value text
        puttsTxt1.selectAll("text")
            .transition()
            .duration(1000)
            .text(personOne["putts/Hole"]);
        puttsTxt2.selectAll("text")
            .transition()
            .duration(1000)
            .text(personTwo["putts/Hole"]);

        scoreSvg.selectAll("rect")
            .data([personOne, personTwo])
            .transition()
            .duration(1000)
            .attr("width", function(d,i){
                return ((d["avgScore"] / 71) * 100)
            });

        scoreAvgLabel.selectAll("text")
            .transition()
            .duration(1000)
            .text("Avg Score");

        scoreTxt1.selectAll("text")
            .transition()
            .duration(1000)
            .text(personOne["avgScore"]);
        scoreTxt2.selectAll("text")
            .transition()
            .duration(1000)
            .text(personTwo["avgScore"]);
        
        person1Txt.selectAll("text")
            .transition()
            .duration(1000)
            .text(personOne["Name"]);
        person2Txt.selectAll("text")
            .transition()
            .duration(1000)
            .text(personTwo["Name"]);

        //will call this after the visualization is updated 
        removeSelectedPlayers();
    }
}
//called when there are 2 players selected it will then remove thoes 2 players after updating the visualization
function removeSelectedPlayers(){
    if(personOne === null){
        alert("There are no players selected.");
    }
    else if(personOne != null && personTwo === null){
        alert("You have one player selected select another to compare.\nIf you wish to remove all players add another then re-select the remove button");
    }
    else{
        personOne = null;
        personTwo = null;
    }
}
