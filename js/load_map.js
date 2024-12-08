var mapLoaded = false
var mapLoaded2 = false
var dynamicLegend
var width = 400;
var height = 25;


async function loadMap(str){

        d3.select("#title2")
        .style("text-anchor", "middle")
        .text( "Forest fires from "+min_year+" to " + max_year +"\n for all communes")
        .attr("font-weight",1500);

        d3.select("#title1")
        .style("text-anchor", "middle")
        .html( "Number of forest fires per year for all departments");

    if (str=="#svg-container"){
        const data = await d3.xml(path_svg_departments);
        await d3.select(str).node().append(data.documentElement);

        
        d3.select("#legend2").attr("style","display: flex; flex-direction: column; margin-bottom: 5px;");
  
        var svg = d3.select("#legend2")
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
        var svg = d3.select("#legend2")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height).attr("transform","translate(10 10)");

        // Create scale
        var scale = d3.scaleLinear()
                    .domain([1, 50])
                    .range([0, width-20]);

        // Add scales to axis
        var x_axis = d3.axisBottom()
                    .scale(scale);

        //Append group and insert axis
        dynamicLegend = svg.append("g")
        .call(x_axis);    

        mapLoaded =true;
        resetDep(str)
        
    }else{
        const data = await d3.xml(path_svg_all);
        await d3.select(str).node().append(data.documentElement);
            mapLoaded2=true;
    }

}

async function waitForMapLoaded(){
    if (mapLoaded === false){
        return setTimeout(waitForMapLoaded, 50)       
    }   
    console.log("Map loaded");
}

function init(str){
    loadMap(str)
    waitForMapLoaded()
}