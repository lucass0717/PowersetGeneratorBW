
// THIS IS THE BG
const width = 600;
const height = 600;
const svg = d3.select("#canvas")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
const table_powersets = []; 
const max_ps = 14; 
const rBase = 5;
var justification = true;
var g_setsize = 1; 
d3.select("#setSizeSlider").attr("max", `${max_ps}`);
d3.select("#instructions").html(`Use the slider to choose a set size [ 1 , ${max_ps} ]`)
genAllPowerSets();
drawSubsets();

d3.select("#setSizeSlider").on("input", function(){          // any time the slider is triggered
    setSize = d3.select("#setSizeSlider").property("value"); // get the value of the slider
    //console.log(genPowerSet(setSize));                     
    d3.select("#setSize").html(`Size: ${setSize}`);          // update the set size with the value of the slider
    d3.selectAll("circle").remove();
    g_setsize = setSize;
    drawSubsets();
});

d3.select("#justify").on("click", function(){
    d3.selectAll("circle").remove();
    justification = !justification;
    drawSubsets(); 
});


// genBinary : Nat -> Array of String where each string is a padded binary representation
//  - genBinary(1) -> ["0", "1"]
//  - genBinary(3) -> ["000", "001", "010", "011", "100", "101", "110", "111"]
function genBinary(n){
    var bin = [];
    for(let i = 0; i < Math.pow(2,n) ; i++) { // iterates through the number of subsets for a set of size n
        var str = i.toString(2);              //converts the index to a binary string, eg: 5 -> "101"
        while(str.length < n)                 //adds padding to the binary strings
            str = "0" + str; 
        bin.push(str);                        //pushes the binary string onto the list of strings
    }
    return bin; 
}

// genPowerSet : Array of String -> Array of Array of Array of Nat :D
//  - genPowerSet(0) -> [ [[]] 
//                      ] 
//  - genPowerSet(3) -> [  [[]]
//                           [[0], [1], [2]]
//                           [[0,1], [0,2], [1,2]]
//                           [[0,1,2]]
//                        ]    
function genPowerSet(n) {
    binaryList = genBinary(n);                   // list of binary strings
    var pS = [];                                 // where the subsets are stored
    for(let i = 0; i < binaryList.length; i++) { // iterate through the list of binary numbers
        var binStr = binaryList[i]; 
        var subset = []; 
        for(let s = 0; s < binStr.length; s++) { // for each index in the binary number, append the index to the subset if there is a 1
            if(binStr[s] == 1)
                subset.push(s); 
        }
        if(subset.length < pS.length) 
            pS[subset.length].unshift(subset); 
            // if the size of the subset is less than the number of distinct size containers in ps, 
            // then append this subset to the front of appropriate size container
        else
            pS.push([subset]);
            // if the size is equal to or greater than the number of distinct size containers in ps
            // eg. [A, B] has 2 elements and ps only has containers for size 0 and 1, 
            // make a new size container with the subset inside
    }
    return pS; 
}

function genAllPowerSets(){
    for(let i = 0; i <= max_ps; i++)
        table_powersets.push(genPowerSet(i));
}

// isSubset : [Array of X] [Array of X] -> Boolean
// This returns whether or not the first array is a subset of the second array
//  - isSubset([],     [1, 2, 3]) -> true
//  - isSubset([3, 1], [1, 2, 3]) -> true
//  - isSubset([2, 4], [1, 2, 3]) -> false 
function isSubset(set1, set2){
    for(var i = 0; i < set1.length; i++){ // for any element in set1
        if(!set2.includes(set1[i]))       // if not an element in set2
            return false;                 // then set1 is not a subset of set2
    }
    return true; 
}

function drawSubsets(){
    if(justification)
        drawSubsetsCenter(g_setsize);
    else
        drawSubsetsLeft(g_setsize);
}

function drawSubsetsCenter (size){
    let r = rBase + (rBase / size);
    let data = table_powersets[size];                            // this is a set of sets of size N
    let yScale = d3.scalePoint()                             // this partitions the heigh of the canvas by the number of different set sizes
        .domain(d3.range(0, data.length + 1))
        .range([r, height]);
    let largestNumX = data[Math.floor(data.length / 2)].length;
    let largestxScale = d3.scalePoint()
        .domain(d3.range(0,largestNumX))
        .range([r,width-r]);
    for(let setSize = 0; setSize < data.length; setSize++){  // this iterates through the set of sets of different sizes
        let setsOfSizeN = data[setSize];                     // all the sets of some size N
        let ypos = yScale(setSize);                          // the current y position we will place these
        let g = svg.append("g")
            .attr("transform", `translate(${(largestxScale(largestNumX-1)-largestxScale(setsOfSizeN.length-1))/2}, ${ypos})`);
        let xScale = d3.scalePoint()
            .domain(d3.range(0,setsOfSizeN.length))
            .range([largestxScale(0), largestxScale(setsOfSizeN.length-1)]);
        setsOfSizeN.forEach(function(d, i){
            g.append("circle")
                .attr("r", r)
                .attr("cy", 0)
                .attr("cx", xScale(i))
                .attr("fill", "#000000");
        });
    }
}

function drawSubsetsLeft (size){
    let r = rBase + (rBase / size);
    let data = table_powersets[size];                            // this is a set of sets of size N
    let yScale = d3.scalePoint()                             // this partitions the heigh of the canvas by the number of different set sizes
        .domain(d3.range(0, data.length + 1))
        .range([r, height]);
    let largestNumX = data[Math.floor(data.length / 2)].length;
    let largestxScale = d3.scalePoint()
        .domain(d3.range(0,largestNumX))
        .range([r,width-r]);
    for(let setSize = 0; setSize < data.length; setSize++){  // this iterates through the set of sets of different sizes
        let setsOfSizeN = data[setSize];                     // all the sets of some size N
        let ypos = yScale(setSize);                          // the current y position we will place these
        let g = svg.append("g")
            .attr("transform", `translate(0, ${ypos})`);
        let xScale = d3.scalePoint()
            .domain(d3.range(0,setsOfSizeN.length))
            .range([largestxScale(0), largestxScale(setsOfSizeN.length-1)]);
        setsOfSizeN.forEach(function(d, i){
            g.append("circle")
                .attr("r", r)
                .attr("cy", 0)
                .attr("cx", xScale(i))
                .attr("fill", "#000000");
        });
    }
}
