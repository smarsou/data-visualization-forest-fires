var idChanged = []

async function testFillMap(){
    const response = await fetch(path_communes_svg);
    const jsonData = await response.json();
    observeAndDoWithData(jsonData,fillBurnedCommune);
}

async function onceBurnedBetweenDate(begin, end){
    const response = await fetch(path_dataset);
    const jsonData = await response.json();
    function filter_date(obj){
        return Date.parse(obj["Date de première alerte"]) >= Date.parse(begin) && Date.parse(obj["Date de première alerte"]) <= Date.parse(end)
    }
    let newData = jsonData.filter(filter_date)
    const ids = await getIdsFromData(newData)
    observeAndDoWithData(ids,fillBurnedCommune)
}

async function distributionBetweenDate(begin, end, node){
    const response = await fetch(path_dataset);
    const jsonData = await response.json();
    function filter_date(obj){
        return Date.parse(obj["Date de première alerte"]) >= Date.parse(begin) && Date.parse(obj["Date de première alerte"]) <= Date.parse(end)
    }
    let newData = jsonData.filter(filter_date)
    const ids = await getIdsFromData(newData)
    //Count the number of fires for each communes and send the distribution to be plot
    const counts = {};
    for (const num of ids) {
        counts[num] = counts[num] ? counts[num] + 1 : 1;
    }
    var distribution = [];
    max = 0
    for (var key in counts) {
        if (!idChanged.includes(key)){
            idChanged.push(key)
        }
        if (counts.hasOwnProperty(key)) {
            if (counts[key]>max){max= counts[key]};
            distribution.push( [ key, counts[key] ] );
        }
    }
    var width = 500,
        height = 25;

        var width = 400,
        height = 25;

    var data = [10, 15, 20, 25, 30];
    
  
    d3.select("#legend1").attr("style","display: flex; flex-direction: column; margin-bottom: 5px;");
  
  	var svg = d3.select("#legend1")
       .append("svg")
       .attr("width", width)
       .attr("height", 25);
       var lg = svg.append("defs").append("linearGradient")
       .attr("id", "mygrad")//id of the gradient
       .attr("x1", "100%")
       .attr("x2", "0%")
       .attr("y1", "0%")
       .attr("y2", "0%")//since its a vertical linear gradient 
       ;
    svg.style("fill", "url(#mygrad)");
       lg.append("stop")
       .attr("offset", "0%")
       .style("stop-color", "red")//end in red
       .style("stop-opacity", 1);
       
       lg.append("stop")
       .attr("offset", "100%")
       .style("stop-color", "yellow")//start in blue
       .style("stop-opacity", 1);
    var rect = svg.append("g").append('rect')
    .attr("style", "width: 400px; height: 25px;")
    
    // Append SVG 
    var svg = d3.select("#legend1")
                .append("svg")
                .attr("width", width)
                .attr("height", height).attr("transform","translate(10 10)");

    // Create scale
    var scale = d3.scaleLinear()
                  .domain([1, max])
                  .range([0, width-20]);

    // Add scales to axis
    var x_axis = d3.axisBottom()
                   .scale(scale);

    //Append group and insert axis
    svg.append("g")
       .call(x_axis);    
    
    observeAndDoWithData(distribution,function(d) {fillDistribution(d,node,max)})
}

async function distributionDepartmentBetweenDate(begin, end){
    const response = await fetch(path_dataset);
    const jsonData = await response.json();
    function filter_date(obj){
        return Date.parse(obj["Date de première alerte"]) >= Date.parse(begin) && Date.parse(obj["Date de première alerte"]) <= Date.parse(end)
    }
    let newData = jsonData.filter(filter_date).map(item => item["Département"])
    const counts = {};
    var max = 0
    for (const num of newData) {
        counts[num] = counts[num] ? counts[num] + 1 : 1;
        if (max < counts[num]) {max= counts[num]}
    }
    // console.log(max)
    // var colorScale = d3
    //     .scaleLinear()
    //     .domain([1, Math.log10(max)])
    //     .range(['yellow', 'red']);
    // for (const num in counts){
    //     if (cummulative){
    //         d3.select("polygon[id='" + num + "']").transition().attr("fill",colorScale(Math.log10(counts[num])));
    //         d3.select("path[id='" + num + "']").transition().attr("fill",colorScale(Math.log10(counts[num])));
    //     }else{
    //         d3.select("polygon[id='" + num + "']").attr("fill",colorScale(Math.log10(counts[num])));
    //         d3.select("path[id='" + num + "']").attr("fill",colorScale(Math.log10(counts[num])));
    //     }
    // }
    var colorScale = d3
        .scaleLinear()
        .domain([1, max])
        .range(['yellow', 'red']);
    for (const num in counts){
        if (cummulative){
            d3.select("polygon[id='" + num + "']").transition().attr("fill",colorScale(counts[num]));
            d3.select("path[id='" + num + "']").transition().attr("fill",colorScale(counts[num]));
        }else{
            d3.select("polygon[id='" + num + "']").attr("fill",colorScale(counts[num]));
            d3.select("path[id='" + num + "']").attr("fill",colorScale(counts[num]));
        }
    }
        var scale = d3.scaleLinear()
                    .domain([1, max])
                    .range([0, width-20]);

        // Add scales to axis
        var x_axis = d3.axisBottom()
                    .scale(scale);

        //Append group and insert axis
        dynamicLegend.transition().call(x_axis);  
}

async function reset(node){
    const response2 = await fetch(path_communes_svg);
    const communes = await response2.json();
    observeAndDoWithData(communes, function(d) { fillReset(d,node)})
}

async function resetDep(node){
    children = d3.select(".departments").node().children
        for (const child of children){
            d3.select("polygon[id='" + child.id + "']").attr("fill","lightgrey")
            d3.select("path[id='" + child.id + "']").attr("fill","lightgrey")
        }
}

// var i = 2
// function update() {
    
//     if (i === 8){
//         i=2
//     }else{
//         i+=1
//     }
//     title.html("201"+i) 
//     distributionBetweenDate('201'+i+'-03-03 11:09:00','202'+(i+1)+'-09-25 11:09:00')
//     setTimeout(update, 1000);
// }

// update()




