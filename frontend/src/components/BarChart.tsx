import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface BarChartProps {
  data: number[];
  labels: string[];
}

const BarChart: React.FC<BarChartProps> = ({ data, labels }: {data: number[], labels: string[]}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr('width', 800)
      .attr('height', 500)
      .style('background', '#f0f0f0')
      .style('margin', '50px')
      .style('overflow', 'visible');

    const xScale = d3.scaleBand()
      .domain(labels)
      .range([0, 800])
      .padding(0.5);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data) || 0])
      .range([500, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
      .call(xAxis)
      .attr('transform', 'translate(0, 500)')
      .style('font-size', '20px');

    svg.append('g')
      .call(yAxis)
      .style('font-size', '20px');

    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => (xScale(labels[i]) !== undefined ? xScale(labels[i])! : 0))
      .attr('y', yScale)
      .attr('width', xScale.bandwidth())
      .attr('height', d => 500 - yScale(d))
      .attr('fill', 'orange');
  }, [data, labels]);

  return <svg ref={svgRef}></svg>;
};

export default BarChart;
