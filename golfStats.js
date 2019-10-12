
function stuff(data){
    console.log(data);
    var tbody = document.getElementById("tbody");
    for (var i = 0; i < data.length; i++) {
	    var tr = "<tr>";
	    tr += "<td>" + data[i]["Name"] + "&nbsp &nbsp &nbsp &nbsp" + "</td>" + "<td>" + data[i]["position"].toString() + "</td></tr>";
 	    tbody.innerHTML += tr;
    }
}

d3.json("https://raw.githubusercontent.com/Tyler-b-123/Data-Visualization-Project/master/playerStats.json").then(stuff);