<template>
    <g :transform="`translate(${left},${top})`" text-anchor="start" class="source">
        <text font-family='sans-serif' font-size= '9px' >Source: {{source}}</text>
    </g>
</template>

<script>
export default {
    name: 'MapSource',
    props:['source','top','left']
}
</script>

<style scoped>
text{
    font-family: sans-serif;
    letter-spacing: 0.2;
    font-weight: 300;
    font-size: 9;
    font-style: italic;
    color: rgba(0, 0, 0, 0.54);
    fill: rgba(0, 0, 0, 0.54);
    stroke: none;
}
</style>