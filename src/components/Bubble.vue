<template>
  <svg id="bubble" :viewBox="`0 0 ${dimension.width} ${dimension.height + 20}`" preserveAspectRatio="xMinYMin meet">
    <defs><clipPath id="bubbleChartClip"><rect :x="0" :y="0" :width="width" :height="height"></rect></clipPath></defs>
    <g id="canvas" :transform="`translate(${margin.left},${margin.top})`" clip-path="url(#bubbleChartClip)">
      <circle :key="`circle-${index}`" v-for="(d, key, index) in geodata" class="dot" :data-area="key" :cx="xScale(d[axis.x])" :cy="yScale(d[axis.y])" r="10" :style="`fill: ${ colorScale(key) }; stroke-width: 2; stroke: transparent`"></circle>
      <text text-anchor="middle" :transform="`translate(${width/2},${height/2})`" style="fill: #ccc; font-size: 84px; font-family: 'SF Pro Text'">{{ periodLabel }}</text>
    </g>
    <g class="x axis" :transform="`translate(${margin.left},${dimension.height-margin.bottom})`"></g>
    <g class="y axis" :transform="`translate(${margin.left},${margin.top})`"></g>
    <Slider :dimension="slider_dimension" :period_range="period_range" />
    <text :transform="`translate(${dimension.width/2},${dimension.height - margin.bottom / 2})`" text-anchor="middle" style="fill: #999; font-family: 'SF Pro Text'">Confirmed</text>
    <text :transform="`translate(${margin.left/2},${dimension.height / 2}) rotate(270)`" text-anchor="middle" style="fill: #999; font-family: 'SF Pro Text'">Deaths</text>
    <text :transform="`translate(${dimension.width/2},${margin.top / 2})`" text-anchor="middle" style="fill: #999; font-family: 'SF Pro Text'">Recovered (Bubble Size)</text>
  </svg>
</template>

<script>
import * as d3 from "d3";
import { getSmartTicks, formatAbbreviation, chartGrids } from '@/statics/functions';

export default {
  name: 'Rank',
  props: ['dimension', 'geodata', 'categories', 'period_range', 'periodSelected'],
  components: {
    Slider: () => import('@/partials/Slider.vue'),
  },
  data(){
    return {
      margin: { top: 40, right: 19.5, bottom: 70, left: 70 },
      radius: 20,
      ticks_count: 10,
      axis: { x: 'confirmed', y: 'deaths', z: 'recovered' },
      playerBtn: { width: 30, height: 30 },
      slide: { radius: 10, handler: 0 },
      transition: { duration: 30000 },
      playing: true
    }
  },
  computed: {
    slider_dimension(){ 
      return { width: this.dimension.width - 150, left: this.margin.left, top: this.dimension.height-this.playerBtn.height }
    },
    svg(){ return d3.select('svg#bubble'); },
    canvas(){ return this.svg.select('#canvas'); },
    width(){ return this.dimension.width - this.margin.left - this.margin.right; },
    height(){ return this.dimension.height - this.margin.top - this.margin.bottom },
    range() {
      return { x: this.categories[0].range, y: this.categories[1].range, z: this.categories[2].range }
    },
    ticks() { 
      return {  x: this.getSmartTicks(this.range.x[1] ),
                y: this.getSmartTicks(this.range.y[1] ),
                z: this.getSmartTicks(this.range.z[1] ) }
    },
    colorScale(){ return d3.scaleOrdinal(d3.schemeCategory10); },
    radiusScale(){ return d3.scaleSqrt().domain(this.range.z).range([0, this.radius]) }, 
    xScale(){ return d3.scaleLinear().domain([this.range.x[0] - this.radiusScale(this.range.z[1]), this.range.x[1] + this.radiusScale(this.range.z[1])]).range([0, this.width]); },
    yScale(){ return d3.scaleLinear().domain([this.range.y[0] - this.radiusScale(this.range.z[1]), this.range.y[1] + this.radiusScale(this.range.z[1])]).range([this.height, 0]); },
    xAxis(){ return d3.axisBottom(this.xScale).tickSize(this.ticks_count); },
    yAxis(){ return d3.axisLeft(this.yScale).ticks(this.ticks.y.count).tickFormat((d)=>this.formatAbbreviation(d)); },
    periodLabel(){ 
      let date = new Date(this.periodSelected);
      return date.toLocaleDateString("en-US", { month: 'long' })
            + " " + date.toLocaleDateString("en-US", { day: 'numeric' })
            + ", " + date.toLocaleDateString("en-US", { year: 'numeric' })
    },
  },
  watch: {
    geodata: {
      handler(){
        this.getAxis();
      },
      deep: true
    }
  },
  mounted(){
    this.$nextTick(() => {
      this.getAxis();
    });
  },
  methods: {
    getSmartTicks,
    formatAbbreviation,
    chartGrids,
    getAxis(){
      this.chartGrids(this.canvas, { x: { scale: this.xScale, ticks: this.ticks.x.count, left: this.margin.left, top: (this.margin.top/2 + this.height) }, y: { scale: this.yScale, ticks: this.ticks.y.count, left: this.margin.left, top: this.margin.top+10 } }, this.width, this.height);

      this.svg.select('.x.axis').call(this.xAxis);
      this.svg.selectAll('.x.axis text')
								.style("font-size", 12)
								.style("font-family", "SF Pro Text")
                .style("font-weight", 100)
                .style("letter-spacing", .7)
                .style("word-spacing", 1)
                .style("fill", "#999");
      this.svg.selectAll('.x.axis line').style("stroke", "#999");
      this.svg.select('.x.axis path').style("stroke", "#999");
                
      this.svg.select('.y.axis').call(this.yAxis);
      this.svg.selectAll('.y.axis text')
              .style("fill", "#999")
              .style("font-size", 12)
              .style("font-family", "SF Pro Text")
              .style("font-weight", 100)
              .style("letter-spacing", .7)
              .style("word-spacing", 1);
      this.svg.selectAll('.y.axis line').style("stroke", "#999");
      this.svg.select('.y.axis path').style("stroke", "#999");
    },
  }
}
</script>

<style scoped>
</style>
