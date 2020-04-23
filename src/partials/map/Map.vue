<template>
  <svg id="map" :viewBox="`0 0 ${dimension.width} ${dimension.height + 20}`" preserveAspectRatio="xMinYMin meet">
    <MapCanvas :mapArea="mapArea" :dataValue="dataValue" :action="action" :dimension="dimension" :path="path" :geojson="geojson" :geodata="geodata" :legends="legends" @mouse-over="onMouseOver" @mouse-out="onMouseOut" />
    <MapLegend  :top="dimension.height - 100" :unit="param.name.unit" :legends="legends" />
    <MapTooltip :data="tooltip" v-if="visibility && tooltip.name" :name="name" :value="value" />
  </svg>
</template>

<script>
import * as d3 from "d3";
import MpGeoJson from '@/assets/geojson/MP.json';

export default {
  name: 'Map',
  props: ['container','dimension','geodata','param','action','breaks','legends','dataValue', 'mapArea'],
  components: {
    MapCanvas: () => import('@/components/map/MapCanvas.vue'),
    MapLegend: () => import('@/components/map/MapLegend.vue'),
    MapSource: () => import('@/components/map/MapSource.vue'),
    MapTooltip: () => import('@/components/map/MapTooltip.vue')
  },
  data(){
    return {
      name: null,
      value: null,
      visibility: true,
      tooltip: {
        x: 0,
        y: 0,
        name: null,
        period: null,
        value: null
      }
    }
  },
  computed: {
    geojson(){
      return MpGeoJson;
    },
    projection(){
      return d3.geoEquirectangular().scale(1).translate([0, 0]).rotate([-11, 0]);
    },
    path(){ 
      return d3.geoPath().projection(this.projection); 
    },
    zoom(){
      return d3.zoom().scaleExtent([0.7, 10]);
    },
    translateVar(){
      return { x: this.dimension.width * 0.05, y: this.dimension.height * 0.05 };
    }
  },
  mounted(){
    this.$nextTick(()=>{
      // Calculate bounding box transforms for entire collection
      var b = this.path.bounds(this.geojson),
      s = 0.95 / Math.max((b[1][0] - b[0][0]) / this.dimension.width, (b[1][1] - b[0][1]) / (this.dimension.height - 50)),
      t = [(this.dimension.width - s * (b[1][0] + b[0][0])) / 2,(this.dimension.height - s * (b[1][1] + b[0][1])) / 2];

      // Update the projection
      this.projection.scale(s).translate(t);
    });
  },
  methods: {
    onMouseOver(value){
      this.visibility = true;
      this.tooltip = value;
    },
    onMouseOut(){
      this.visibility = false;
      this.tooltip.name = null;
      this.tooltip.period = null;
      this.tooltip.value = null;
    },
    center_translate(d){
      var centroid = this.path.centroid(d);
      return "translate(" + centroid[0] + ", " + centroid[1] + ")";
    }
  }
}
</script>

<style scoped>

</style>