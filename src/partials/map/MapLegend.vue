<template>
    <g id="legendWrapper" :transform="`translate(50,${top})`">
        <g class="unit">
            <text style="font-family:inherit!important; font-size:12px">{{ unit }}</text>
        </g>
        <g :key="index" v-for="(legend,index) in legends" class="legend" :transform="`translate(0,${index * 20 + 10})`">
            <rect width="15" height="15" :style="`fill: ${legend.color}`" transform="translate(0,0)" />
            <text  style="font-family:inherit!important; font-size:11px" transform="translate(23,0)" dy="12">{{ legend.from }} - {{ legend.to }}</text>
        </g>
        <g class="legend" transform="translate(0, 70)">
            <rect width="15" height="15" style="fill: #ccc" transform="translate(0,0)" />
            <text  style="font-family:inherit!important; font-size:11px" transform="translate(23,0)" dy="12">Missing data</text>
        </g>
    </g>
</template>

<script>
import {formatAbbreviation} from "@/statics/functions";
export default {
    name: 'MapLegend',
    props: ['top','unit','legends'],
}
</script>

<style scoped>
/deep/text{
    font-size: 12px;
    font-family: 'SF Pro Text';
  
}
rect{
    stroke: #464646;
    stroke-width: 0.4;
    shape-rendering: crispEdges;
}
/deep/.text.label
{
  font-size: 12px!important;
    font-weight: 600;
}
.unit {
    font-family: inherit !important;
    font-size: 12px;
    font-weight: bold;
}
</style>