<template>
  <g id="player" :transform="`translate(${dimension.left},${dimension.top})`">
    <image :xlink:href="playerImage" x="0" y="0" :width="playerBtn.width" :height="playerBtn.height" @click="play(transition.duration)" style="cursor: pointer; stroke-width: 1px;" />
    <g :transform="`translate(${playerBtn.width+15},${parseInt(playerBtn.height/2)})`">
      <line id="player_slider" :x1="sliderScale.range()[0]" :x2="sliderScale.range()[1]" style="fill: #ccc; stroke: #000; stroke-opacity: 0.1; stroke-width: 3" />
      <circle id="handler" :r="slide.radius" :cx="slide.handler" style="fill: #607889; stroke: #fff; stroke-width: 6px;" />
    </g>
  </g>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'Slider',
  props: ['dimension','period_range'],
  data() {
    return {
      playerBtn: { width: 30, height: 30 },
      slide: { radius: 10, handler: 0 },
      playing: false,
      transition: { duration: 30000 },
    }
  },
  computed: {
    svg(){ return d3.select('svg'); },
    sliderScale(){ 
      return d3.scaleTime().domain(this.period_range)
      .range([0, this.dimension.width]); 
    },
    playerImage(){ 
      return this.playing ? require('@/assets/images/pause-button.svg') : require('@/assets/images/play-button.svg');
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.svg.select('circle#handler')
          .call(d3.drag()
            .on("start.interrupt", this.interrupted)
            .on("start drag", this.dragged)
          );
    });
  },
  methods: {
    interrupted(d) {
      d3.select('#player').interrupt();
    },
    dragged(d) {
      if (d3.event.x >= this.sliderScale.range()[0] && d3.event.x <= this.sliderScale.range()[1]) {
        this.slide.handler = d3.event.x;
        var date = this.sliderScale.invert(this.slide.handler);
        this.$parent.$emit('changePeriodSelected', `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
      }
    },
    play(duration) {
      this.playing = !this.playing;

      if(this.playing){
        this.svg.transition()
            .duration(duration)
            .ease(d3.easeLinear)
            .tween("year", this.tweenYear)
            .on("end", this.endSlide);
      } else {
        this.svg.transition()
            .duration(null);
      }
    },
    tweenYear() {
      if (this.slide.handler) {
        var slided = d3.interpolateNumber(this.slide.handler, this.sliderScale.range()[1]);
      } else {
        var slided = d3.interpolateNumber(this.sliderScale.range()[0], this.sliderScale.range()[1]);
      }

      return (t) => { 
        this.slide.handler = slided(t);
        var date = this.sliderScale.invert(this.slide.handler);
        this.$parent.$emit('changePeriodSelected', `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
      };
    },
    endSlide() {
			this.playing = false;
      // Cancel the current transition, if any.
      this.svg.transition().duration(0);
      this.slide.handler = 0;
    }
  }
}
</script>