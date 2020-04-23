<template>
  <svg id="rank" :viewBox="`0 0 ${dimension.width} ${dimension.height + 20}`" preserveAspectRatio="xMinYMin meet" style="cursor:pointer">
    <defs><clipPath id="columnRankClip"><rect x="0" :y="margin.top" :width="dimension.width" :height="dimension.height-margin.top"></rect></clipPath></defs>
    <g id="canvas" :transform="`translate(${margin.left},${margin.top})`" clip-path="url(#columnRankClip)">
      <g id="bars" :transform="`translate(${scroll_x},0)`">
        <rect :key="`rect-${index}`" v-for="(d, index) in dataset" class="bar" :x="xScale(d.name)" :y="yScale(d.value)" :width="xScale.bandwidth()" :height="height - yScale(d.value)" :data-area="d.name" :style="`fill: ${colorScale(index)}; stroke-width: 2; stroke: transparent`"><title>{{ d.value }} ({{ d.name }})</title></rect>

        <text :key="`text-${index}`" v-for="(d, index) in dataset" class="value" :x="xScale(d.name) + xScale.bandwidth() / 2" :y="((yScale(d.value) + 20) < (height-20)) ? (yScale(d.value) + 20):(height-20)" style="font-size: 12px; fill: #333" text-anchor="middle">{{ formatAbbreviation(d.value) }}<title>{{ d.value }} ({{ d.name }})</title></text>
      </g>
      <g class="x axis" :transform="`translate(${scroll_x},${height})`"></g>
    </g>
    <g class="y axis" :transform="`translate(${margin.left},${margin.top})`"></g>
    <Slider :dimension="slider_dimension" :period_range="period_range" />
  </svg>
</template>

<script>
import * as d3 from "d3";
import { getSmartTicks, formatAbbreviation } from '@/statics/functions';

export default {
  name: 'Rank',
  props: ['dimension', 'geodata', 'period_range', 'categorySelected'],
  components: {
    Slider: () => import('@/partials/Slider.vue'),
  },
  data(){
    return {
      margin: { top: 30, right: 19.5, bottom: 180, left: 85 },
      bar_size: 40,
      padding: 0.1,
      ticks_count: 10,
      scroll_x: 0,
      zoom: null,
      playerBtn: { width: 30, height: 30 },
      transition: 300,
    }
  },
  computed: {
    colorScale(){ return d3.scaleOrdinal(d3.schemeCategory10); },
    slider_dimension(){ 
      return { width: this.dimension.width - 150, left: this.margin.left, top: this.dimension.height-this.playerBtn.height }
    },
    values() { return Object.keys(this.geodata).map((ar) => this.geodata[ar][this.categorySelected]); },
    svg(){ return d3.select('svg'); },
    canvas(){ return this.svg.select('#canvas'); },
    width(){ return this.dataset.length * this.bar_size; },
    height(){ return this.dimension.height - this.margin.top - this.margin.bottom },
    dataset(){
      var data = [];
      Object.keys(this.geodata).forEach(ar=>{
        data.push({ name: ar, value: this.geodata[ar][this.categorySelected] });
      });
      data.sort((a,b)=>b.value-a.value);
      return data;
    },
    maxValue(){ return d3.max(this.values); },
    yTicks(){ return this.getSmartTicks(this.maxValue); },
    xScale(){ return d3.scaleBand().domain(this.dataset.map(function (d) { return d.name })).range([0, this.width]).padding(this.padding); },
    yScale(){ return d3.scaleLinear().domain([0, this.yTicks.endPoint]).range([this.height, 0]); },
    xAxis(){ return d3.axisBottom(this.xScale).tickSize(this.ticks_count); },
    yAxis(){ return d3.axisLeft(this.yScale).ticks(this.yTicks.count).tickFormat((d)=>this.formatAbbreviation(d)); },
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
    getAxis(){
      this.canvas.selectAll(".x.axis").transition().duration(this.transition).call(this.xAxis)
      // .call(d3.axisBottom(x).tickSizeOuter(0))
      
      // this.canvas.select('.x.axis').call(this.xAxis);
      this.canvas.selectAll('.x.axis text')
								.style("text-anchor", "end")
								.style("font-size", 12)
								.style("font-family", "SF Pro Text")
                .style("font-weight", 100)
                .style("letter-spacing", .7)
                .style("word-spacing", 1)
                .style("fill", "#999")
								.attr("dx", "-1.5em")
								.attr("dy", "-.9em")
                .attr("transform", "rotate(270)");
      this.canvas.selectAll('.x.axis line').style("stroke", "#999");
      this.canvas.select('.x.axis path').style("stroke", "#999");
                
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

      this.zoom = d3.zoom().on("zoom",this.zoomed);
      this.svg.call(this.zoom);
    },
    zoomed(){
      this.scroll_x = ((d3.event.transform.x > 0)?0:d3.event.transform.x);
      this.svg.select('.x.axis').call(this.xAxis);
    }
  }
}
</script>

<style scoped>

</style>
