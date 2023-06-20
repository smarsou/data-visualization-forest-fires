function fillReset(obj, node){
    let str = obj.replace(/'/g, '\\\'')
    d3.select(node).select("polygon[id='" + str + "']").attr("fill","#b9b9b9");
}

function fillBurnedCommune(obj,node){
    let str = obj.replace(/'/g, '\\\'')
    d3.select("polygon[id='" + str + "']").attr("fill","red");
}

function fillDistribution(obj,node,max){

    // var colorScale = d3.scaleSequential()
    // .interpolator(d3.interpolateInferno)
    // .domain([1,max])

    var colorScale = d3
        .scaleLinear()
        .domain([1, Math.log(max)])
        .range(['yellow', 'red']);
    
    // var colorScale = d3.scaleOrdinal()
    // .domain([1,max])
    // .range(["yellow","orange","red"]);
    let str = obj[0].replace(/'/g, '\\\'');
    d3.select(node).select("polygon[id='" + str + "']")
        .attr("fill",colorScale(Math.log(obj[1])));
    if (idChanged.includes(obj[0])){
        idChanged.pop(obj[0])
    }

}
