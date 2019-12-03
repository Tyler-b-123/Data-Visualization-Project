# Data-Visualization-Project-Final-Version
Important note: if you are on a smaller display you may need to change the scale in your web browser<br />
If for some reason someone finds this page feel free to do whatever you want with the code, <br />
but I do not own the data just the code. <br />
This visualizaton requiers the user to click on 2 dots to then show a more detailed comparison of the 2 selected players<br />
It automatically removes the 2 players after the visualization is updated so you can select 2 more players afterwards<br />
without haveing to click any remove buttons<br />
In the second part of the visualization the driveing stats bar the width refers to the driving accuracy<br />
Meaning that the wider the bar the higher the accuracy<br />
In this visualization there are 4 files. <br />
<ul>
  <li>golfStats.css (used for formatting)</li>
  <li>golfStats.js (uses d3.js to make the graphs and other visualization's)</li>
  <li>playerStats.json (is the data note: i call it from the github in the program)</li>
  <li>index.html (the page that the user see's contains the divs and text explaning how it works)</li>
</ul>
This data set is the top 50 golfers from the 2017/2018 PGA Tour season. <br />
This is a list of what all of the fields refer too from the json file.
<ul>
  <li>The "Name" field refers to the golfers name.</li>
  <li>The "position" field refers to the golfers rainking based on the stats.</li>
  <li>The "Yds/Drive" filed is the players average yards per drive.</li>
  <li>The "drivingAcc" filed is the players accuracy meaning the % of the time they hit the fairway off the tee.</li>
  <li>The "putts/Hole" field is the players average amount of putts they take per hole.</li>
  <li>The "birdies" field is how many birdies the player had that season.</li>
  <li>The "birdieConv" field is how many times they convert a green in regulation to a birdy.</li>
  <li>The "avgScore" field is what there average score is that year (lower is better).</li>
  <li>The "avgFinish" field is there average tournament placement from that season (lower is better).</li>
</ul>
