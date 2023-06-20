var data = [];
var data2 = [];
var data3 = [];
var data4 = [];
var countCause = {"Natural" : 0, "Malicious": 0, "Unintentionally (work)" : 0, "Unintentionally (people)" : 0 ,"Accidentally": 0, "Unknown": 0}
var dataLoaded = false

var max_damages = 0
async function charts_loadData(){
    const response = await fetch(path_dataset);
    const jsonData = await response.json();
    const response2 = await fetch(path_communes_dataset);
    const communes = await response2.json();
    var year = 2012
    function filter_date(obj){
        return obj["Année"] == year
    }
    
    max_damages=0
    for (let i = min_year; i<max_year;i++){
        year = i
        let newData = jsonData.filter(filter_date)
        data.push(newData.length)

        count = {"d": 0 , "bpd" : 0, "btd": 0}
        for (const i in newData){
            if (newData[i]["Nombre de décès"]!=""){
                count["d"] += newData[i]["Nombre de décès"].toInt()
            //     if(newData[i]["Nombre de décès"].toInt()!=0){
            //     console.log("Mort "+newData[i]["Nombre de décès"].toInt())
            // }
            }
            if (newData[i]["Nombre de bâtiments partiellement détruits"]!=""){
                count["bpd"] += newData[i]["Nombre de bâtiments partiellement détruits"]
                // if (newData[i]["Nombre de bâtiments partiellement détruits"]!=0){
                //     console.log("BD " + newData[i]["Nombre de bâtiments partiellement détruits"])
                // }
            }
            if (newData[i]["Nombre de bâtiments totalement détruits"]!=""){
                count["btd"] += newData[i]["Nombre de bâtiments totalement détruits"]
                // if (newData[i]["Nombre de bâtiments totalement détruits"]!=0){
                //     console.log("BTD " + newData[i]["Nombre de bâtiments totalement détruits"])
                // }
            }
        }
        max_damages = max_damages< count["d"]+ count["btd"]+ count["bpd"] ? count["d"]+ count["btd"]+ count["bpd"] : max_damages; 
        data2.push(count)
        count = 0
        for (const i in newData){
            if (newData[i]["Surface parcourue (m2)"]!=""){
                count += newData[i]["Surface parcourue (m2)"]*0.0001
            }
        }

        data3.push(count)

        // count = 0
        // for (const i in newData){
        //     if (newData[i]["Nombre de bâtiments totalement détruits"]!=""){
        //         count += newData[i]["Nombre de bâtiments totalement détruits"]
        //     }
        // }
        // data4.push(count)

        for (const i in newData){
                switch (newData[i]["Nature"]){
                        case "Involontaire (travaux)" :
                            countCause["Unintentionally (work)"]=countCause["Unintentionally (work)"]+1
                        break;
                        case "Involontaire (particulier)" :
                            countCause["Unintentionally (people)"]=countCause["Unintentionally (people)"]+1
                        break;
                        case "Malveillance" :
                            countCause["Malicious"]=countCause["Malicious"]+1
                        break;
                        case "Accidentelle" :
                            countCause["Accidentally"]=countCause["Accidentally"]+1
                        break;
                        case "" :
                            countCause["Unknown"]=countCause["Unknown"]+1
                        break;
                        default:
                            countCause["Unknown"]=countCause["Unknown"]+1
                        break;
            }
        }
    dataLoaded = true
    }
}


function loadBarCharts(){
    if (dataLoaded === false){
        return setTimeout(loadBarCharts, 50)       
    }
    console.log("BarChart and Data loaded")
    barchart1(data)
    barchart2(data3)
}

function loadCausesCharts(){
    if (dataLoaded === false){
        return setTimeout(loadCausesCharts, 50)       
    }
    console.log("BarChart and Data loaded")
    piechart(true)
    stackbar(data2)
}




function vh(percent) {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (percent * h) / 100;
  }

  function vw(percent) {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    return (percent * w) / 100;
  }
  
function linechart(){
    var margin = { top: 20, bottom: 70, left: 80, right: 20 };
    var width = 500 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;
    var barPadding = 4;
    var barWidth = width / data.length - barPadding;

    var x = d3.scaleBand()
        .domain(d3.range(data3.length))
        .rangeRound([0, width]);
        
    var y = d3.scaleLinear()
        .domain([0, d3.max(data3)])
        .range([height, 0]);

    var svg2 = d3.select("#subody")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom + margin.top)
        .attr("style","border: 1px solid grey; background-color: white;")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

    var xAxis = d3.axisBottom()
        .scale(x)
        .tickFormat(function (d, i) { return i + min_year; });

    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(10);

    svg2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "middle");

    svg2.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6).attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Value");

    svg2.append("text")
        .attr("x", (width / 2))
        .attr("y", (height + (margin.bottom / 2)))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Measurement");

    svg2.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height / 2))
        .attr("y", 0 - margin.left)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Value");

    svg2.append("text")
        .attr("x", (width / 2))
        .attr("y", margin.top)
        .style("text-anchor", "middle")
        .text("TITLE");

    var valueline = d3.line().curve(d3.curveBasis)
        .x(function (d, i) { return x(i); })
        .y(function (d) { return y(d); });

    var linechart = svg2.append("path")
        .attr("class", "line")
        .attr("d", valueline(data))
        .style("stroke", "blue")
        .attr("fill", "none");

    var linechart2 = svg2.append("path")
        .attr("class", "line")
        .attr("d", valueline(data2))
        .style("stroke", "green")
        .attr("fill", "none");


    var linechart2 = svg2.append("path")
        .attr("class", "line")
        .attr("d", valueline(data3))
        .style("stroke", "red")
        .attr("fill", "none");

}

function barchart1(data){
    var margin = { top: 40, bottom: 50, left: 110, right: 20 };
    var width = vw(50) - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;
    var barPadding = 4;
    var barWidth = width / data.length - barPadding;

    var x = d3.scaleBand()
        .domain(d3.range(data.length))
        .rangeRound([0, width]);
    var y = d3.scaleLinear()
        .domain([0, d3.max(data)])
        .range([height, 0]);

    var svg = d3.select("#barchart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom + margin.top)
        .attr("style","border: 1px solid grey; background-color: white;margin: 10px;")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

    var xAxis = d3.axisBottom()
        .scale(x)
        .tickFormat(function (d, i) { return i + min_year; });

    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(10);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "middle");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6).attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Value");

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", (height + (margin.bottom / 2)))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Year");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height / 2))
        .attr("y", 0 - margin.left/1.2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Count");

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", -margin.top/3)
        .style("text-anchor", "middle")
        .text("NUMBER OF FOREST FIRES EACH YEAR");

    var barchart = svg.selectAll("rect")
        .data(data).enter()
        .append("rect")
        .attr("x", function (d, i) { return x(i); })
        .attr("y", y)
        .attr("height", function (d) { return height - y(d); })
        .attr("width", barWidth)
        .attr("fill", "blue");

    function upd(i, j) {
        data[i] = j;
        svg.selectAll("rect")
            .data([0, 1])
            .exit().attr("fill", "red");
    }
}

function barchart2(data){
    var margin = { top: 40, bottom: 50, left: 110, right: 50 };
    var width = vw(50) - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;
    var barPadding = 4;
    var barWidth = width / data.length - barPadding;

    var x = d3.scaleBand()
        .domain(d3.range(data.length))
        .rangeRound([0, width]);
    var y = d3.scaleLinear()
        .domain([0, d3.max(data)])
        .range([height, 0]);

    var svg = d3.select("#barchart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom + margin.top)
        .attr("style","border: 1px solid grey; background-color: white; margin: 10px;")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

    var xAxis = d3.axisBottom()
        .scale(x)
        .tickFormat(function (d, i) { return i + min_year; });

    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(10);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "middle");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6).attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Surface (ha)");

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", (height + (margin.bottom / 2)))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Year");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height / 2))
        .attr("y",  - margin.left/1.2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Surface (ha)");

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", -margin.top/3)
        .style("text-anchor", "middle")
        .text("SURFACE OF FOREST BURNED EACH YEAR");

    var barchart = svg.selectAll("rect")
        .data(data).enter()
        .append("rect")
        .attr("x", function (d, i) { return x(i); })
        .attr("y", y)
        .attr("height", function (d) { return height - y(d); })
        .attr("width", barWidth)
        .attr("fill", "red");

    function upd(i, j) {
        data[i] = j;
        svg.selectAll("rect")
            .data([0, 1])
            .exit().attr("fill", "red");
    }
}


var pieArcs
var color
var arc
var labelArc
var labelArc2
var pie
var piesvg
var piewidth
var pieheight
var texts 
function piechart(show){

    piewidth = 600;
    pieheight = 600;
    var outerRadius = 200;
    //var innerRadius = 0; 
    // for donut chart use this value --> 
    var innerRadius = 0;

    color = d3.schemeCategory10;
    arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

    labelArc = d3.arc()
    .innerRadius(innerRadius+150)
    .outerRadius(outerRadius+150);

    labelArc2 = d3.arc()
    .innerRadius(innerRadius+110)
    .outerRadius(outerRadius+110);

    pie = d3.pie()
    .value(function(d) { return d.value; });

    piesvg = d3.select("#piechart")
    .append("svg")
    .attr("width", piewidth)
    .attr("height", pieheight).attr("style","background-color:white; border: 1px solid grey;");
    piesvg.append("text")
    .attr("x", (piewidth / 2))             
    .attr("y", (pieheight-10))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("text-decoration", "underline")  
    .text("Forest fires causes "+ min_year+ " to "+ (max_year-1));

    
    change(show)
}

function change(show){
    pieArcs = piesvg.selectAll("g.pie")
        .data(pie(data))
        .remove()
    data = []
    for (const prop in countCause) {
        if (prop=="Unknown" && show){
            data.push({name: prop, value: countCause[prop]})
        }else if(prop != "Unknown"){
            data.push({name: prop, value: countCause[prop]})
        }
    }
        pieArcs = piesvg.selectAll("g.pie")
        .data(pie(data))
        .enter()
        .append("g")    
        .attr("class", "pie")
        .attr("transform", "translate(" + (piewidth / 2) + ", " + (pieheight / 2) + ")");
        
        pieArcs.append("path")
        .attr("fill", function(d, i) { return color[i]; })
        .attr("d", arc);
        
        texts = pieArcs.append("text");
        texts.transition().attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; }) .attr("text-anchor", "middle")
        .text(function(d) { return d.value; });
        
        pieArcs.append("text")
        .attr("transform", function(d) { 
        var distance = labelArc.centroid(d)
        if (d.data.name === "Natural"){
            distance = labelArc2.centroid(d)
        }
        return "translate(" + distance + ")"; }) .attr("text-anchor", "middle")
        .text(function(d) { return d.value!=0 ? d.data.name : ""; });
}



function stackbar(data){
    var margin = { top: 40, bottom: 50, left: 110, right: 20 };
    var width = 600 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;
    var barPadding = 4;
    var barWidth = width / data.length - barPadding;

    var x = d3.scaleBand()
        .domain(d3.range(data.length))
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .domain([0, max_damages])
        .range([height, 0]);

    var svg = d3.select("#barchart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom + margin.top)
        .attr("style","border: 1px solid grey; background-color: white;margin: 10px;")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

    var xAxis = d3.axisBottom()
        .scale(x)
        .tickFormat(function (d, i) { return i + min_year; });

    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(10);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "middle");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6).attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Value");

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", (height + (margin.bottom / 2)))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Year");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height / 2))
        .attr("y", 0 - margin.left/1.2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Count");

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", -margin.top/3)
        .style("text-anchor", "middle")
        .text("BUILDING DAMAGED OR DESTROYED BY A FOREST FIRE");

    var barchart = svg.selectAll("rect")
        .data(data).enter()
        .append("rect")
        .attr("x", function (d, i) { return x(i); })
        .attr("y", y )
        .attr("height", function (d) {
            return height - y(d.btd+d.bpd); })
        .attr("width", barWidth)
        .attr("fill", "orange");

    function upd(i, j) {
        data[i] = j;
        svg.selectAll("rect")
            .data([0, 1])
            .exit().attr("fill", "red");
    }
}
    