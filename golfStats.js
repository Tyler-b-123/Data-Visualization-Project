
function createChart(){
    d3.json("https://raw.githubusercontent.com/Tyler-b-123/Data-Visualization-Project/master/playerStats.json").then(stuff);
function stuff(data){
    console.log(data);
   
    var chartType = document.getElementById('selectForm').value;
    console.log(chartType);
    //this is all just a prof of concept to see how it works not finalized at all may change the size aswell
    var margin = {top: 100, right: 20, bottom: 30, left:40},
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    /*
    adding the axis for the data, this will be me just trying out doing player rank and yds/drive 
    just to see how it looks will prob use a select tag or something to chose what you are going to see
    also may play around with the color and do something like have it make the dot a diff color based on players rank
    like have it be 1-10 are blue and etc.
    */
   var personOne = null;
   var personTwo = null;
   var chartTitle = null;
   
    if (chartType === "Yds/Drive"){
        alert("You have chosen Yds/Drive");
        chartTitle = "Average Yards per Drive";
        drawPoints(285, "Yds/Drive");
    }
    if (chartType === "drivingAcc"){
        alert("You have chosen drivingAcc");
        chartTitle = "Driver Accuracy";
        drawPoints(50, "drivingAcc");
    }
    if (chartType === "putts/Hole"){
        alert("You have chosen putts/Hole");
        chartTitle = "Average Putts per Hole";
        drawPoints(1.6, "putts/Hole");
    }
    if (chartType === "birdies"){
        alert("You have chosen birdies");
        chartTitle = "Total Birdies";
        drawPoints(100, "birdies");
    }
    if (chartType === "birdieConv"){
        alert("You have chosen the birdie conversion rate");
        chartTitle = "Birdie Conversion Rate %";
        drawPoints(25, "birdieConv");
    }
    if (chartType === "avgScore"){
        alert("You have chosen the average score");
        chartTitle = "Average Score";
        drawPoints(68.5, "avgScore");
    }
    if (chartType === "avgFinish"){
        alert("You have chosen the average finish");
        chartTitle = "Average Finish";
        drawPoints(15, "avgFinish");
    }

   function drawPoints(offset, comparison){
    var x = d3.scaleLinear()
        .range([0, width]);
    
    var y = d3.scaleLinear()
        .range([height, 0]);

    x.domain(d3.extent(data, function(d) {
        return d["position"];
    }));

    y.domain([offset, d3.max(data, function (d){
        return d[comparison];
    })]);

    var valueLine = d3.line()
        .x(function (d){
            return x(d["position"]);
        })
        .y(function (d){
            return y(d[comparison]);
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
            return x(d["position"]);
        })
        .attr("cy", function (d){
            return y(d[comparison]);
        })
        .attr("fill", "black")
        .style('opacity', .6)
        //mouse overs so that you know which dot you are about to press
        .on('mouseover', function (d,i){
            d3.select(this).transition()
                .duration('10')
                .style('opacity', 1);
        })
        .on('mouseout', function (d,i){
            d3.select(this).transition()
                .duration('10')
                .style('opacity', .6);
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
            .attr("x", (width + (margin.left + margin.right))/2)
            .attr("y", -150 + margin.top)
            .attr("text-anchor", "middle")
            .attr("font-size", "30px")
            .attr("font-family", "sans-serif")
            .text(chartTitle);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        svg.append("g")
            .call(d3.axisLeft(y).tickFormat(function (d){
                return d3.format("") (d)
            }));

        }
}
}
