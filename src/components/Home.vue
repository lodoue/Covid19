<template>
  <section>
    <b-form-select v-model="areaSelected" :options="areas" size="sm" class="mt-3"></b-form-select>
    <b-form-select v-model="periodSelected" :options="periods" size="sm" class="mt-3"></b-form-select>
    <b-form-select v-model="categorySelected" :options="categories" size="sm" class="mt-3"></b-form-select>
    <b-form-select v-model="graphSelected" :options="graphs" size="sm" class="mt-3"></b-form-select>

    <Dashboard :dataset="dataset" :areaSelected="areaSelected" :periodSelected="periodSelected" :categories="categories" />

    <div id="container" ref="mapContainer">
      <keep-alive>
        <component v-bind:is="activeComponent" :dimension="dimension" :geodata="geodata" :categorySelected="categorySelected" :categories="categories" :periodSelected="periodSelected" :period_range="period_range" @changePeriodSelected="changePeriodSelected"></component>
      </keep-alive>
    </div>
  </section>
</template>

<script>
import * as d3 from 'd3';
import { getCovid19DataService } from '@/services';

export default {
  name: 'Home',
  components: {
    Dashboard: () => import('@/partials/Dashboard.vue'),
  },
  data() {
    return {
      areas: [{ value: null, text: 'World' }],
      dimension: {},
      dataset: {},
      areaSelected: null,
      periodSelected: null,
      categorySelected: 'confirmed',
      period_range: [],
      categories: [
        { value: 'confirmed', text: 'Confirmed', range: [], all: 0 },
        { value: 'deaths', text: 'Deaths', range: [], all: 0 },
        { value: 'recovered', text: 'Recovered', range: [], all: 0 },
      ],
      graphs: [
        { value: 'map', text: 'Map'},
        { value: 'rank', text: 'Rank'},
        { value: 'bubble', text: 'Bubble'},
      ],
      graphSelected: 'map',
    };
  },
  computed: {
    activeComponent() {
      switch(this.graphSelected){
        case 'map':
          return () => import('@/components/Map.vue');
          break;
        case 'rank':
          return () => import('@/components/Rank.vue');
          break;
        case 'bubble':
          return () => import('@/components/Bubble.vue');
          break;
      }
    },
    periods() {
      const data = Object.keys(this.dataset).length ? this.dataset[Object.keys(this.dataset)[0]].map((d) => ({ value: d.date, text: d.date })) : [];
      data.unshift({ value: null, text: 'Select Period' });
      return data;
    },
    range() {
      let data = [];
      Object.keys(this.dataset).forEach((ar) => {
        data = data.concat(this.dataset[ar]);
      });

      this.categories.forEach(category=>{
        category.range = d3.extent(data, d => d[category.value]);
      });
      return data;
    },
    geodata() {
      const data = {};
      Object.keys(this.dataset).forEach((ar) => {
        const result = this.dataset[ar].find((d) => d.date === this.periodSelected);
        if (result) data[ar] = result;
      });
      return data;
    },
  },
  mounted() {
    this.dimension = this.$refs.mapContainer.getBoundingClientRect();
    getCovid19DataService().then((response) => {
      this.dataset = response;
      this.periodSelected = this.dataset[Object.keys(this.dataset)[0]][0].date;
      this.setCategoryRange();
    },
    (error) => {
      console.log(error);
    });
  },
  methods: {
    setCategoryRange(){
      let data = [];
      Object.keys(this.dataset).forEach((ar) => {
        this.areas.push({ value: ar, text: ar });
        data = data.concat(this.dataset[ar]);
        this.categories.forEach(category=>{
          if(this.dataset[ar][this.dataset[ar].length-1][category.value] != undefined)
          category.all += this.dataset[ar][this.dataset[ar].length-1][category.value];
        });
      });

      this.categories.forEach(category=>{
        category.range = d3.extent(data, d => d[category.value]);
      });

      this.period_range = d3.extent(data, d => { 
        let str = d.date.split('-');
        return new Date(+str[0],+str[1]-1,+str[2]);
      });
    },
    changePeriodSelected(value){
      this.periodSelected = value;
    },
  }
};
</script>

<style scoped>
#container {
  width: 100%;
  height: 90vh;
}
select {
  width: 200px;
  margin: 0 10px 0 0;
}
</style>
