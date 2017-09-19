// The original GML data
// (https://en.wikipedia.org/wiki/Graph_Modelling_Language)
// includes the following attribution:
// Creator "Mark Newman on Wed Oct 18 16:42:04 2006"

// It was manually (ie with vim (http://www.vim.org/)) converted to JSON.
//

d3.json("https://raw.githubusercontent.com/mattiaz88/data-visualization/master/week3/js/polbooks.json", function(error, graph) {

if (error) return console.warn(error);

var orientationColor = {
    "c" /* conservative */ : {
        fill: "#0808B9",
        stroke: "#FFF" // darkblue
    },

    "l" /* liberal */ : {
        fill: "#FD0", // yellow
        stroke: "#FFF"
    },

    "n" /* neutral */ : {
        fill: "#A9A9A9", // darkgray
        stroke: "#FFF"
    }
};

var nodes = graph.nodes;

// Compute the distinct nodes from the links.
var links = graph.edges;

var width = 960,
    height = 500;

var force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([width, height])
    .linkDistance(60)
    .charge(-300)
    .on("tick", tick)
    .start();

var svg = d3.select("#graph").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(d3.behavior.zoom().on("zoom", redraw))
    .call(d3.behavior.drag());

function redraw() {
    svg.attr("transform","translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
}

// add the links and the arrows
var path = svg.append("svg:g").selectAll("path")
    .data(force.links())
    .enter().append("svg:path")
    .attr("class", "link");


// define the nodes
var node = svg.selectAll(".node")
    .data(force.nodes())
    .enter().append("g")
    .attr("class", "node");

// add the nodes
node.append("circle")
    .attr("r", function(d) {
        return Math.max(d.weight/2,5);
    })
    .style("fill", function(d) {
        return orientationColor[d.value].fill;
    })
    .style("stroke", function(d) {
        return orientationColor[d.value].stroke;
    })
    .on("mouseover", function(d) {
        var xPos = parseFloat(d3.select(this).attr("x")) + 10;
        var yPos = parseFloat(d3.select(this).attr("y")) + 20;

        d3.select("#tooltip")
            .style("left", xPos + "px")
            .style("top", yPos + "px");

        d3.select("#title").text(d.label);
        d3.select("#value").text(d.weight);

        d3.select("#tooltip").classed("hidden", false);
    })
    .on("mouseout", function() {
        d3.select("#tooltip").classed("hidden", true);
    });

// add the text
// node.append("text")
//     .attr("x", 12)
//     .attr("dy", ".35em")
//     .text(function(d) { return d.label; });

// add the curvy lines
function tick() {
    path.attr("d", function(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" +
            d.source.x + "," +
            d.source.y + "A" +
            dr + "," + dr + " 0 0,1 " +
            d.target.x + "," +
            d.target.y;
    });

    node
        .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")"; });
}

});
