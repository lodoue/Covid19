<template>
  <g id="maptoolbar" :transform="transform">
    <g :key="index" v-for="(tool, index) in tools" :transform="`translate(0,${position(index)})`">
      <image :xlink:href="require(`@/assets/icons/${tool.icon}`)" :width="width" :height="height" style="cursor: pointer; stroke-width: 1px;" @click="onClick(tool)" />
      <g v-show="show" :key="index2" v-for="(childtool, index2) in tool.childs" :transform="`translate(-${width},${position(index2)})`">
        <image :xlink:href="require(`@/assets/icons/${childtool.icon}`)" :width="width" :height="height" style="cursor: pointer; stroke-width: 1px;" />
      </g>
    </g>
  </g>
</template>

<script>
export default {
  name: 'MapToolbar',
  props: ['transform','width','height'],
  data(){
    return {
      pos: 0,
      show: false
    }
  },
  computed: {
    tools(){ 
      var data = [
        { name: "pie", icon: "pie.svg", title: "Pie" },
        { name: "table", icon: "table.svg", title: "Table" },
        { name: "label", icon: "label.svg", title: "Label On" },
        { name: "full-screen", icon: "collapse.svg", title: "Collapse" },
        { name: "zoom-in", icon: "zoom_in.svg", title: "Zoom in" },
        { name: "zoom-out", icon: "zoom_out.svg", title: "Zoom out" },
        { name: "compass", icon: "compass.svg", title: "North Pole" },
        { name: "download", icon: "download.svg", title: "Download" },
        { name: "share", icon: "share.svg", title: "Share", childs: [ 
            { name: "facebook", title: "Facebook", icon: "facebook.svg" },
            { name: "linkedin", title: "Linkedin", icon: "linkedin.svg" },
            { name: "twitter", title: "Twitter", icon: "twitter.svg" }
          ] 
        },
        { name: "break-point", icon: "break_points.svg", title: "Customize Legend" }];

      return data;
    },
  },
  methods: {
    onClick(tool){
      switch(tool.name){
        case 'pie':
          this.$emit('toggle-bubble');
          break;
        case 'label':
          this.$emit('toggle-label');
          break;
        case 'compass':
          this.$emit('toggle-compass');
          break;
      }
    },
    position(index){
      this.pos = index?(+this.pos)+(+this.height)+10:0;
      return this.pos;
    }
  }
}
</script>

<style scoped>
ul.toolbar_li li.hide-break{
  display:none;
}

ul.toolbar_li li {
    padding: 10px;
    cursor: pointer;
}
.child-tree
{
      position: absolute;
    top: 365px;
    right: 36px;
    background: red;
    padding: 0px;
}
ul{
    margin-top: 0;
    margin-bottom: 1rem;
    position: absolute;
    top: 270px;
    right: 35px;
}
li.toollist img {
    width: 20px;
}
.inner-toolist>li:nth-of-type(2n+1) {
    background-color: rgba(0, 0, 0, .04);
}
ul{
list-style-type:none;
}
li{
list-style-type:none;
}
li.toollist {
  position:relative;
}
li.toollist > .inner-toolist{
     position: absolute;
    right: 40px;
    top: 10px;
}
li.toollist > .inner-toolist img{
  width: 12px!important;
}


li.toollist:nth-child(2):after {
   display: inline-block;
    /* margin-left: 10px; */
    vertical-align: 0.255em;
    content: "";
    border-top: 0.25em solid;
    border-right: 0.25em solid transparent;
    border-bottom: 0;
    border-left: 0.25em solid transparent;
    top: 21px;
    left: -3px;
    position: absolute;
    transform: rotate(90deg);
}
/* li.toollist:nth-child(2):after:hover {
     border: 1px solid #b5b5b5;
} */
li.toollist:nth-child(2)
{
 border: 1px solid #fff;
    padding: 5px;
    margin: 5px;
}
/* li.toollist:nth-child(2):hover {
  border: 1px solid #b5b5b5;
} */
</style>