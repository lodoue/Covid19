<template>
  <g id="canvas" :transform="`translate(${action.translate[0]},${action.translate[1]}) scale(${action.scale})`">
    <g id="shapes">
      <path class="shape" :d="path(d)" :key="index" v-for="(d,index) in geojson.features" :data-code="d.properties.ID_" :style="`fill: ${pathColor(d.properties.ID_)}; stroke: #000; stroke-width: 0.7;`"></path>
    </g>
    <g id="labels" v-show="tool.label">
      <text font-size="12" class="label" :key="index" v-for="(d,index) in geojson.features" text-anchor="middle" :transform="center_translate(d)"><tspan x="0" :y="-3">{{ d.properties.NAME1_ }}</tspan><tspan x="0" :y="10">{{ labelValue(d.properties.ID_) }}</tspan></text>
    </g>
    <g id="bubbles" v-show="tool.bubble">
      <MapBubble :radius="radius" :key="index" v-for="(d,index) in geojson.features" :transform="center_translate(d)" :dataset="bubbleData(d.properties.ID_)" />
    </g>
    <g v-show="tool.compass" :transform="`translate(${dimension.width - 70}, ${dimension.height - 70})`" class="map_compass">
      <image class="compass" :xlink:href="require('@/assets/icons/compass.svg')" width="40" height="40" />
    </g>
    <MapToolbar :transform="`translate(${dimension.width - 10}, 100)`" width="20" height="20" @toggle-bubble="tool.bubble = ! tool.bubble" @toggle-label="tool.label = ! tool.label" @toggle-compass="tool.compass = ! tool.compass" />
  </g>
</template>

<script>
import AreaMapping from '@/assets/json/mapping.json';

export default {
  name: 'MapCanvas',
  props: ['dimension', 'path', 'geojson', 'legends', 'action', 'geodata', 'categorySelected','radius'],
  data(){
    return {
      tool: { bubble: false, label: false, compass: true }
    }
  },
  components: {
    MapBubble: () => import('@/partials/map/MapBubble.vue'),
    MapToolbar: () => import('@/partials/map/MapToolbar.vue'),
  },
  methods: {
    labelValue(code){
      var area = AreaMapping[code];
      var data = this.geodata[area] ? this.geodata[area][this.categorySelected] : null;
      return data;
    },
    pathColor(code){
      var color = '#CCC';
      var area = AreaMapping[code];

      if(this.geodata[area]){
        var data = this.geodata[area][this.categorySelected];

        this.legends.forEach(legend=>{
          if(data >= legend.from && data <= legend.to)
          color = legend.color;
        });
      }
      return color;
    },
    center_translate(d) {
      const centroid = this.path.centroid(d);
      return `translate(${centroid[0]}, ${centroid[1]})`;
    },
    bubbleData(code) {
      let area = AreaMapping[code];
      if(this.geodata[area]){
        let data = Object.keys(this.geodata[area]).filter(key=>key != 'date').map(key=>({ name: key, value: this.geodata[area][key] }));
        return data.filter(d=>d.value>0).length?data:[];
      } else {
        return [];
      }
    }
  },
};
</script>

<style scoped>
</style>
