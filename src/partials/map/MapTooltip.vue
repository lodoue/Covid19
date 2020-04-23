<template>
    <g id="MapTooltip" :transform="`translate(${data.x},${data.y})`">
        <rect rx="2" :width="rectWidth" :height="rectHeight"></rect>
        <text class="areaname" x="10" y="20">{{ data.name }}</text>
        <text v-if="data.value" class="areavalue" x="10" y="38">{{ data.value }} ({{data.period}})</text>
    </g>
</template>

<script>
import { calculateTextWidth } from '@/statics/functions';

export default {
    name: 'MapTooltip',
    props: ['name','value','data'],
    computed: {
        rectWidth(){
            let areaWidth = calculateTextWidth(this.data.name, 12);
            let valueWidth = calculateTextWidth(this.data.value, 14);
            return (areaWidth > valueWidth ? areaWidth : valueWidth) + 20;
        },
        rectHeight(){
       return (this.data.value) ? 50 : 30
    },
    mounted(){
    }
}
}
</script>

<style scoped>
rect{
    fill: #fff;
    stroke: #000!important;
    stroke-width: 1;
    width:110px!important;
}
.areaname{
    font-size: 10px;
    font-weight: 700;
    fill: #000!important;
}
.areavalue{
    fill: #000!important;
    font-size: 10px;
    font-weight: 500;
}
</style>