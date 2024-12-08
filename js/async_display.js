var booltest = false
function observeAndDoWithData(data_p,doStuff) {

    var data = data_p
    isFinished = true
    begin = 0
    step = 100
    end = step

    async function doHugeStuff(){
        ifFinished = false
        for (let i = begin; i<end; i++){
            doStuff(data[i])
        }
        isFinished = true
    }

    function observe(){
        if(isFinished===false) {//we want it to match
            setTimeout(observe, 50); //wait 50 millisecnds then recheck
        return;
        }
        doHugeStuff()
        begin += step
        end += step
        if (end>data.length){
            console.log("End of huge stuff")
            booltest = true
            return;
        }
        observe()
    }
    console.log("Start huge stuff")
    observe()
}