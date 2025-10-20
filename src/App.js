import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { wordFrequency: [] };
  }

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  // helper: compute word frequencies
  getWordFrequency = (text) => {
    const stopWords = new Set([
      "the","and","a","an","in","on","at","for","with","about","as","by","to","of","from","that","which",
      "who","whom","this","these","those","it","its","they","their","them","we","our","ours","you","your",
      "yours","he","him","his","she","her","hers","was","were","is","am","are","be","been","being","have",
      "has","had","having","do","does","did","doing","as","if","each","how","what","while","during","before",
      "after","until","without","through","over","under","above","below","between","among","towards","into"
    ]);

    const words = text
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=_`~()?"']/g, "")
      .split(/\s+/)
      .filter((word) => word && !stopWords.has(word));

    const freqMap = {};
    words.forEach((w) => {
      freqMap[w] = (freqMap[w] || 0) + 1;
    });
    return Object.entries(freqMap);
  };

renderChart() {
  const data = this.state.wordFrequency.sort((a, b) => b[1] - a[1]).slice(0, 5);
  const width = 1000;
  const height = 200;

  const svg = d3
    .select(".svg_parent")
    .attr("width", width)
    .attr("height", height);

  // --- SCALES ---
  const fontSize = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[1]) || 1])
    .range([20, 70]);

  const xScale = d3
    .scalePoint()
    .domain(data.map((d) => d[0]))
    .range([100, width - 100])
    .padding(0.5);

  const centerY = height / 2 + 20;

  // --- DATA JOIN ---
  const texts = svg.selectAll("text").data(data, (d) => d[0]); // key by word

  // --- ENTER SELECTION ---
  const enter = texts
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .attr("opacity", 0)
    .attr("x", (d) => xScale(d[0]) - 50) // start slightly left of target
    .attr("y", centerY)
    .attr("font-size", 5) // very small start
    .text((d) => d[0]);

  enter
    .transition()
    .duration(1000)
    .attr("opacity", 1)
    .attr("x", (d) => xScale(d[0]))
    .attr("font-size", (d) => fontSize(d[1]));

  // --- UPDATE SELECTION ---
  texts
    .transition()
    .duration(1000)
    .attr("x", (d) => xScale(d[0])) // slide horizontally if position changes
    .attr("font-size", (d) => fontSize(d[1])) // grow/shrink smoothly
    .attr("fill", "black");

  // --- EXIT SELECTION ---
  texts
    .exit()
    .transition()
    .duration(600)
    .attr("opacity", 0)
    .attr("font-size", 5)
    .remove();
}


  render() {
    return (
      <div className="parent">
        <div className="child1" style={{ width: 1000 }}>
          <textarea
            type="text"
            id="input_field"
            style={{ height: 150, width: 1000 }}
          />
          <button
            type="submit"
            style={{ marginTop: 10, height: 40, width: 1000 }}
            onClick={() => {
              const input_data = document.getElementById("input_field").value;
              this.setState({ wordFrequency: this.getWordFrequency(input_data) });
            }}
          >
            Generate WordCloud
          </button>
        </div>
        <div className="child2">
          <svg className="svg_parent"></svg>
        </div>
      </div>
    );
  }
}

export default App;
