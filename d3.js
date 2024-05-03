const width = 150;
const height = 150;
const animateBtn = d3.select("#start");
const clearBtn = d3.select("#clear");
const movebtn = d3.select("#transition");
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const startX = screenWidth - 400;
const startY = screenHeight / 2;

const drawSmile = () => {
    const svg = d3
        .select("svg")
        .attr("x", startX)
        .attr("y", startY)
        .attr("width", width)
        .attr("height", height);

    // Рисуем круглое лицо
    svg.append("circle")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("r", height / 2 - 25)
        .attr("fill", "yellow");

    // Рисуем глаза
    svg.append("circle")
        .attr("cx", width / 2 - 25)
        .attr("cy", height / 2 - 25)
        .attr("r", height / 12)
        .attr("fill", "black");

    svg.append("circle")
        .attr("cx", width / 2 + 25)
        .attr("cy", height / 2 - 25)
        .attr("r", height / 12)
        .attr("fill", "black");

    // Рисуем рот
    svg.append("rect")
        .attr("x", width / 2 - height / 4)
        .attr("y", height / 2)
        .attr("width", height / 2)
        .attr("height", height / 8)
        .attr("rx", height / 16)
        .attr("ry", height / 16)
        .attr("fill", "black");

    // Рисуем зуб
    svg.append("rect")
        .attr("x", width / 2 - height / 14)
        .attr("y", height / 1.93 - height / 50)
        .attr("width", height / 8)
        .attr("height", height / 8)
        .attr("fill", "white");

    // Рисуем брови
    svg.append("path")
        .attr(
            "d",
            `M${width / 2 - height / 4},${height / 2 - height / 4} Q${
                width / 2
            },${height / 2 - height / 6} ${width / 2 + height / 4},${
                height / 2 - height / 4
            }`
        )
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", height / 20);

    svg.append("path")
        .attr(
            "d",
            `M${width / 2 + height / 4},${height / 2 - height / 4} Q${
                width / 2
            },${height / 2 - height / 6} ${width / 2 - height / 4},${
                height / 2 - height / 4
            }`
        )
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", height / 20);

    return svg;
};

let pic = drawSmile();
let angle = 0;

animateBtn.on("click", () => {
    let duration = d3.select("#duration").property("value");
    angle += Number(d3.select("#rotation").property("value"));

    pic.transition()
        .duration(duration)
        .attr("transform", `rotate(${angle % 360})`);
});

clearBtn.on("click", () => {
    pic.remove();
});

function moveAlongSquareContour(selection, size, duration) {
    const path = d3.path();
    const sideLength = size;

    // Create a square path
    path.moveTo(0, 0);
    path.lineTo(0, sideLength);
    path.lineTo(sideLength, sideLength);
    path.lineTo(sideLength, 0);
    path.closePath();

    // Append a path element to the selection
    const pathElement = selection
        .append("path")
        .attr("d", path)
        .style("fill", "none");
    // .style("stroke", "black");

    // Create a transition for the selection
    const t = selection.transition().duration(duration).ease(d3.easeLinear);

    // Translate and rotate the selection along the square path
    t.attrTween("transform", function () {
        const i = d3.interpolateString("0,0", path.toString());
        return function (t) {
            const point = pathElement
                .node()
                .getPointAtLength(t * pathElement.node().getTotalLength());
            return `translate( ${point.x} , ${point.y}) rotate(${t * 360})`;
        };
    });
}

movebtn.on("click", () => {
    let duration = Number(d3.select("#duration").property("value"));
    console.log(duration);
    moveAlongSquareContour(pic, 400, duration);
});
