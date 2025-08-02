import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const App = () => {
  const svgRef = useRef();

  useEffect(() => {
    fetch('./workflow_graph.json')
      .then(res => res.json())
      .then(drawGraph);
  }, []);

  const drawGraph = (treeData) => {
    const width = 900;
    const height = 600;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const root = d3.hierarchy({ name: 'root', children: treeData });
    const treeLayout = d3.tree().size([height - 40, width - 100]);
    const treeRoot = treeLayout(root);

    svg.append("g").selectAll("line")
      .data(treeRoot.links())
      .enter()
      .append("line")
      .attr("x1", d => d.source.y)
      .attr("y1", d => d.source.x)
      .attr("x2", d => d.target.y)
      .attr("y2", d => d.target.x)
      .attr("stroke", "#007aff")
      .attr("stroke-width", 2);

    svg.append("g").selectAll("rect")
      .data(treeRoot.descendants())
      .enter()
      .append("rect")
      .attr("x", d => d.y - 50)
      .attr("y", d => d.x - 15)
      .attr("width", 100)
      .attr("height", 30)
      .attr("rx", 10)
      .attr("fill", "#fff")
      .attr("stroke", "#ccc");

    svg.append("g").selectAll("text")
      .data(treeRoot.descendants())
      .enter()
      .append("text")
      .attr("x", d => d.y)
      .attr("y", d => d.x + 5)
      .attr("text-anchor", "middle")
      .text(d => d.data.name)
      .style("font-weight", "bold")
      .style("font-family", "sans-serif");
  };

  return <svg ref={svgRef}></svg>;
};

export default App;