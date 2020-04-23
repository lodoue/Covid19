<template>
<li>
        <b-form-group class="text-goal" label-class="font-weight-bold  t-label"
          label-cols="7" label-cols-lg="7" label="Target Period">
          <b-form-select  v-model="plannedPeriodSelected" class="t-list" :options="targetPeriod"></b-form-select>
        </b-form-group>
        <b-form-group class="text-goal" label-class="font-weight-bold  t-label"
            label-cols="5" label-cols-lg="5" label="Period">
            <b-form-select v-model="periodSelected"  class="t-list" :options="periods" ></b-form-select>
        </b-form-group>
</li>
</template>

<script>
export default {
    name: 'MapPeriod',
    props: ['periodSelected','plannedPeriodSelected','targetPeriod','periods'],
    data(){
    return {
      
      }
  },
  computed: {
   periods(){
      var data = [...new Set(this.dataset.filter(d =>(d._id !='IND023' && d._id != 'IND')).map(d=>{
                return d.actual.map(a=>({ name: a.period.name, date: a.period.end }));
            }).flat().sort((a,b)=>new Date(a.date) - new Date(b.date)).map(p=>p.name))].map(period=>({value: period, text: period}));
      data.unshift({value: null, text: 'Most Recent'});
      return data;
    }
   },
    methods : {
       
    }
}
</script>

<style scoped>

</style>
