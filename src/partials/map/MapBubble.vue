<template>
  <g :transform="transform">
    <path :key="index" v-for="(arcs, index) in pie(dataset)" :d="arc(arcs)" :style="`fill: ${colorScale(index)}; stroke: #fff; stroke-width: 1px`"><title>{{ arcs.data.value }} ({{ arcs.data.name }})</title></path>
  </g>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'MapBubble',
  props: ['transform','radius','dataset'],
  computed: {
    arc(){ return d3.arc().innerRadius(0).outerRadius(this.radius); },
    pie(){ return d3.pie().value(d => d.value).sort(null); },
    colorScale(){ return d3.scaleOrdinal(["#a442f5","#7242f5","#e78ac3"]); },
  }
}
</script>