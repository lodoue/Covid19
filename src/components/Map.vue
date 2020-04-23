<template>
  <svg id="map" :viewBox="`0 0 ${dimension.width} ${dimension.height + 20}`" preserveAspectRatio="xMinYMin meet">
    <MapCanvas :dimension="dimension" :path="path" :geojson="geojson" :action="action" :legends="legends" :geodata="geodata" :categorySelected="categorySelected" :radius="radius" />
    <MapLegend :top="dimension.height - 100" unit="Number" :legends="legends" />
    <!-- <MapTooltip :data="tooltip" v-if="visibility && tooltip.name" :name="name" :value="value" /> -->
    <Slider :dimension="slider_dimension" :period_range="period_range" />
  </svg>
</template>

<script>
import * as d3 from 'd3';
import WorldGeoJson from '@/assets/geojson/world.json';

export default {
  name: 'Map',
  props: ['dimension', 'geodata', 'categorySelected', 'period_range'],
  components: {
    MapCanvas: () => import('@/partials/map/MapCanvas.vue'),
    MapLegend: () => import('@/partials/map/MapLegend.vue'),
    Slider: () => import('@/partials/Slider.vue'),
    // MapTooltip: () => import('@/partials/map/MapTooltip.vue'),
  },
  data() {
    return {
      name: null,
      value: null,
      visibility: true,
      tooltip: {
        x: 0,
        y: 0,
        name: null,
        period: null,
        value: null,
      },
      action: {
        label: false,
        translate: [0, 0],
        scale: 0.97,
        compass: false,
      },
      radius: 15
    };
  },
  computed: {
    slider_dimension(){ 
      return { width: this.dimension.width - 250, left: 150, top: this.dimension.height - 50 }
    },
    traffic_color() {
      var colors = ['#4CBB17', '#FF7800', '#E60000'];
      switch(this.categorySelected){
        case 'confirmed':
        case 'deaths':
          return colors;
          break;
        case 'recovered':
          return colors.reverse();
      }
    },
    geojson() {
      return WorldGeoJson;
    },
    projection() {
      return d3.geoEquirectangular().scale(1).translate([0, 0]).rotate([-11, 0]);
    },
    path() {
      return d3.geoPath().projection(this.projection);
    },
    zoom() {
      return d3.zoom().scaleExtent([0.7, 10]);
    },
    translateVar() {
      return { x: this.dimension.width * 0.05, y: this.dimension.height * 0.05 };
    },
    values() {
      return Object.keys(this.geodata).map((ar) => this.geodata[ar][this.categorySelected]);
    },
    decimal() {
      this.values.sort((a,b)=>{
        const a_decimal = Number.isInteger(a)?0:a.toString().split('.').length;
        const b_decimal = Number.isInteger(b)?0:b.toString().split('.').length;
        return a_decimal-b_decimal;
      });
      return this.values.length?Number.isInteger(this.values[0])?0:this.values[0].toString().split('.').length:0;
    },
    legends() {
      const data = d3.extent(this.values);
      const diff = (data[1] - data[0]) / 3;
      const lower = Math.floor(data[0]);
      return [
        { color: this.traffic_color[0], from: +lower.toFixed(this.decimal), to: +(lower+diff).toFixed(this.decimal) }, 
        { color: this.traffic_color[1], from: +(lower+diff+Math.pow(10,-this.decimal)).toFixed(this.decimal), to: +(lower+diff*2).toFixed(this.decimal) },
        { color: this.traffic_color[2], from: +((lower+diff*2)+Math.pow(10,-this.decimal)).toFixed(this.decimal), to: +Math.ceil(data[1]).toFixed(this.decimal) },
      ];
    },
  },
  mounted() {
    this.$nextTick(() => {
      // Calculate bounding box transforms for entire collection
      const b = this.path.bounds(this.geojson);
      const s = 0.95 / Math.max((b[1][0] - b[0][0]) / this.dimension.width, (b[1][1] - b[0][1]) / (this.dimension.height - 50));
      const t = [(this.dimension.width - s * (b[1][0] + b[0][0])) / 2, (this.dimension.height - s * (b[1][1] + b[0][1])) / 2];

      // Update the projection
      this.projection.scale(s).translate(t);
    });
  },
  methods: {
    center_translate(d) {
      const centroid = this.path.centroid(d);
      return `translate(${centroid[0]}, ${centroid[1]})`;
    },
  },
};
</script>

<style scoped>

</style>
