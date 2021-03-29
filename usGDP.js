let body = d3.select("body")
body.append("h2").text("US GDP over time").attr("id", "title")
body.append("p").text("Darker color means that GDP went down, lighter color means it went up (compared to the previous value)")
let data;
let padding = 100
let h = window.innerHeight-200
let w = h*2
let xScale = d3.scaleTime()
let yScale = d3.scaleLinear()
let svg = body.append("svg")
            .attr("height", h)
            .attr("width", w)
            .attr("id", "chart")
let tooltip = body.append("div") 
                .attr("id", "tooltip")
                .attr("style", "opacity: 0;")
                .attr("data-date", "")
let xAxis = d3.axisBottom(xScale);
let yAxis = d3.axisLeft(yScale);

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    .then(a=>a.json())
    .then(json=>{
        let data = json.data
        let difference = data.map((a,b,c)=>a[1]/c[b>0?b-1:0][1]-1)
        let color = d3.scaleLinear()
            .domain([d3.min(difference), d3.max(difference)])
            .range(["black", "rgb(179, 224, 238)"])

        yScale.domain([0, d3.max(data, d=>d[1])]).range([h-padding, 0])


        xScale.domain(
            [d3.min(data, d=>new Date(d[0])), 
            d3.max(data, d=>new Date(d[0]))])
            .range([0, w-padding-20])


        svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", "translate("+padding+", " + (h-padding) + ")")
            .call(xAxis)

        svg.append("g")
            .attr("id", "y-axis")
            .attr("transform", "translate("+padding+", " + 0 + ")")
            .call(yAxis)


        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d, i)=>xScale(new Date(d[0]))+padding)
            .attr("y", (d)=>yScale(d[1]))
            .attr("width", w/data.length)
            .attr("height", (d)=>yScale(0)-yScale(d[1]))
            .attr("fill", (d,i)=>color(difference[i]))
            .attr("class", "bar")
            .attr("data-date", (d)=>d[0])
            .attr("data-gdp", (d)=>d[1])
            .attr("difference", (d,i)=>difference[i])


            .on("mouseover", (d,e,c)=>{
                d3.select("#tooltip")
                    .style("opacity", "1")
                    .style("left", (d.clientX+25) + "px")
                    .style("top", (d.clientY + 25) + "px")
                    .attr("data-date", d.explicitOriginalTarget.attributes["data-date"].value)
                    .text(`Date: ${e[0]}\nDifference: ${Math.floor((d.target.attributes["difference"].value)*10000)/100}`)
            })
            .on("mouseleave", (d)=>{
                d3.select("#tooltip")
                    .style("opacity", "0")
            })
    })