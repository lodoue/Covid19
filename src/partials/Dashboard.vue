<template>
  <section>
    <div :key="index" v-for="(category, index) in categories" class="text-center">
      <b-button variant="primary">
        {{ category.text }}
        <b-badge variant="light">{{ categoryCount(category.value) }} <span class="sr-only">{{ category.text }}</span></b-badge>
      </b-button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Dashboard',
  props: ['dataset','periodSelected','areaSelected','categories'],
  methods: {
    categoryCount(value) {
      if(this.areaSelected){
        let result = this.dataset[this.areaSelected].find(d=>d.date==this.periodSelected);
        return result[value];
      } else {
        let cnt = 0;
        Object.keys(this.dataset).forEach((ar) => {
          let result = this.dataset[ar].find(d=>d.date==this.periodSelected);
          if(result){
            cnt += result[value];
          }
        });
        return cnt;
      }
    }
  }
}
</script>

<style scoped>
section {
  display: inline-block;
}

section > div{
  float: left;
  margin: 0 10px 0 0;
}
</style>