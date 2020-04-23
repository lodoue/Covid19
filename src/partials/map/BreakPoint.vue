<template>
   <section>
      <div class="break-point" style="z-index:9999;" >
         <b-modal size="lg"  id="modal-lg" hide-footer v-model="$parent.breakPointShow" title="Index">
            <div class="col-md-12" style="padding:0;">
            </div>
            <div class="break_div">
               <table class="table table-bordered">
                  <thead>
                     <tr style="background-color:#eee">
                        <th><strong>Caption</strong></th>
                        <th><strong>From</strong></th>
                        <th><strong>To</strong></th>
                        <th><strong>Count</strong></th>
                        <th><strong>Color</strong></th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr :key="index" v-for="(legend, index) in tempLegends">
                        <td>{{legend.label}}</td>
                        <td>   
                          <span v-if="legend.label != 'Missing Data'">
                            <b-form-input v-model="legend.from" readonly type="number"></b-form-input>
                            </span>
                            <span  v-if="legend.label == 'Missing Data'">
                              {{legend.from}}
                            </span>
                          </td>
                        <td>
                          <span  v-if="legend.label != 'Missing Data'">
                            <b-form-input @keyup="onChange($event, index)" :readonly="legend.to == 100 ? true: false" v-model="legend.to" type="number"></b-form-input>
                            </span>
                            <span  v-if="legend.label == 'Missing Data'">
                              {{legend.to}}
                            </span>
                        </td>
                        <td>{{areaCount(legend)}}</td>
                        <td>
                          <swatches colors="text-advanced" popover-to="left"   v-model="legend.color" />
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
            <div class="btn-last clearfix buttonsmargin">
               <button  class="btn btn-primary pull-right mr-3" @click="setLegends();$parent.breakPointShow = false" >Ok</button>
            </div>
         </b-modal>
      </div>
   </section>
</template>

<script>
import {saveMonitoringData} from '@/services'
import {path_color, calculate_performance} from '@/statics/functions'
import Swatches from 'vue-swatches'
import "vue-swatches/dist/vue-swatches.min.css"
export default {
  name: "BreakPoint",
  components: { Swatches },
  props:['breakPointShow', 'legends', 'geodata', 'areaName'],
  data() {
    return {
      values : [],
      tempLegends: []
    }
  },
  computed : {
    minValue(){
      return this.break_values.sort((a,b)=>a-b)[0];
    },
    maxValue(){
      return this.break_values.sort((a,b)=>b-a)[0];
    },
    maxDecimal(){
      var data = this.break_values.sort((a,b)=>{
        a = a.toString().split('.');
        b = b.toString().split('.');
        a = a.length>1?a[1].length:0;
        b = b.length>1?b[1].length:0;
        return b-a;
      })[0].toString().split('.');
      return data.length > 1?data[1].length:0;
    },
    break_values(){
      return this.tempLegends.filter(d=>!(isNaN(d.from) || isNaN(d.to))).map(d=>[d.from,d.to]).flat();
    }
  },
  methods : {
    calculate_performance,
    onChange(event, index){
      var decimal = this.maxDecimal;
      var break_from = +event.target.value;
      var breaks = this.break_values.length/2;
      var div = (this.maxValue-break_from)/(breaks-(index+2));
      var break_to = break_from;

      for(var i = index+1; i < breaks-1; i++){
        break_to += div;
        break_from += Math.pow(10,-decimal);
        
        this.tempLegends[i].from = break_from.toFixed(decimal);
        if(breaks-2==i) break_to -= 1;
        this.tempLegends[i].to = break_to;
        break_from = break_to;
      }
    },
    valuesCount(){
      Object.keys(this.geodata).forEach((g,k) => {
      this.values.push(parseInt(this.calculate_performance(this.geodata[g])))
      });
    },
    areaCount(legend){
      return this.values.filter(value => (value >= legend.from && value <= legend.to)).length;
    },
    setLegends(){
      saveMonitoringData(this.tempLegends).then(response => {
        this.$parent.$emit('legendColors', JSON.parse(JSON.stringify(this.tempLegends)));
      })
    },
  },
    mounted(){
      this.tempLegends = JSON.parse(JSON.stringify(this.legends));
      this.valuesCount();
    }
}
</script>

<style scoped >
/deep/label#input-group-2__BV_label_ {
    margin-right: 5px !important;
    font-size: 11px;
}
/deep/.table thead th:nth-child(1)
{
  width:30%!important;
}
/deep/.table thead th:nth-child(2)
{
  width:25%!important;
}
/deep/.table thead th:nth-child(3)
{
  width:25%!important;
}
/deep/.table thead th:nth-child(4)
{
  width:10%!important;
}
/deep/.table thead th:nth-child(5)
{
  width:10%!important;
}
/deep/form.form-inline{
margin-top:10px !important;
margin-bottom:10px !important;
}

/deep/select#break-count {
    min-width: 50px !important;
}
/deep/.missing
{
      margin: 0!important;
    padding: 0 10px!important;
    font-size: 36px;
    font-weight: bolder;
}
/deep/select#decimal{

   min-width: 50px !important;
}

/deep/input#input-2 {
    margin: 0px;
    max-width:70px !important;
}

/deep/.btn-last.clearfix.buttonsmargin {
    margin-top: 5px;
    margin-bottom: 10px;
    margin-right: 5px;
}

/deep/input.form-control{

  margin:0px;
}
/deep/.evo-pointer.evo-colorind{

  float:none;
}

/deep/.table-bordered>tbody>tr>td{

      vertical-align: middle;
}
/deep/.table-bordered>tbody>tr>td:nth-child(3){

      padding: 5px!important;
}
/deep/.table-bordered>tbody>tr>td:nth-child(2){

      padding: 5px!important;
}
/deep/.table-bordered>tbody>tr>td:last-child{

      padding: 5px!important;
}
/deep/.form-control:disabled, .form-control[readonly] {
    background-color: #fff!important;
    opacity: 0.5!important;
}
/deep/.form-control:focus {
    border-color: #ced4da!important;
}
/deep/.table td {
    padding: 16px 0 0 10px !important;
}
/deep/.vue-swatches__trigger
{
  width: 20px!important;
    height: 20px!important;
        border-radius: 2px!important;
        text-align: center;
}
.vue-swatches {
   
    text-align: center!important;
    margin: 5px 0!important;
}
/deep/div#modal-lg .form-inline .form-group {
    display: block;
    margin-right: 14px;
}
/deep/div#modal-lg > div {
    width: 800px!important;
}
/deep/.break-point{
  width: 434px;
}
/deep/form.form-inline {
    margin-top: 10px!important;
    margin-bottom: 10px!important;
}
/deep/h5.modal-title {
    text-transform: none;
    color: #000;
    background: #eee;
    padding: 8px 15px; 
    font-weight: 400;
    font-size: 18px;
    display: block;
    width: 100%;
}
/* /deep/.modal-content{
  width: 434px!important;
} */
/deep/.btn-primary:hover {
    color: #fff;
    background-color: #0069d9;
    border-color: #0062cc;
}
/deep/.mr-3 {
    margin-right: 1rem!important;
}
/deep/.modal-header .close {
    background: #000!important;
    width: 30px!important;
    height: 30px!important;
    line-height: 30px!important;
    padding: 0!important;
    position: relative!important;
    z-index: 111!important;
    opacity: 1!important;
}
/deep/.modal.fade button.close {
    
    border-radius: 50%;
    color: #fff;
    margin-left: -29px;
    right: 5px;
   top:5px;
}
/deep/.modal-body {
    position: relative;
    -ms-flex: 1 1 auto;
    -webkit-box-flex: 1;
    flex: 1 1 auto;
    padding: 0 1rem;
}
/deep/.modal-header {
    display: -ms-flexbox;
    display: -webkit-box;
    display: flex;
    -ms-flex-align: start;
    -webkit-box-align: start;
    align-items: flex-start;
    -ms-flex-pack: justify;
    -webkit-box-pack: justify;
    justify-content: space-between;
    /* padding: 1rem 1rem; */
    border-bottom: 1px solid #dee2e6;
    border-top-left-radius: 0.3rem;
    padding: 0!important;
    border-top-right-radius: 0.3rem;
}
/deep/.table {
    width: 100%;
    margin-bottom: 1rem;
    color: #212529;
}
/deep/table {
    border-collapse: collapse;
}
/deep/.modal-dialog {
    text-align: left;
}
/deep/body {
    background: #fff;
    color: #666;
    font-family: SF Pro Text,sans-serif!important;
}
/deep/body {
    font-size: 12px;
}
/deep/b, strong {
        font-size: 14px!important;
    font-weight: 600!important;
}
.table thead th
{
  background-color: #fff!important;
 
}

.table tbody td
{
  background-color: #fff!important;
  font-size: 13px!important;
    font-weight: 100!important;
}
/deep/.pull-right {
    float: right!important;
}
/deep/.btn{
  display: inline-block;
    font-weight: 400;
    color: #212529;
    text-align: center;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-color: transparent;
    border: 1px solid transparent;
    padding: .375rem .75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: .25rem;
}
/deep/.btn-primary {
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
}
/deep/.btn {
    font-size: 11px!important;
}
/deep/.mr-3, .mx-3 {
    margin-right: 1rem!important;
}
/deep/.break_div{
    margin-left: -15px;
    margin-right: -15px;
    padding: 10px;
}
/deep/input#input-2 {
    margin: 0;
    max-width: 80px !important;
}
/deep/.form-inline .custom-select, .form-inline .input-group {
    width: 100%;
}
/deep/input{
    margin: 0;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    width: 100%;
}
/deep/.evo-pointer.evo-colorind {
    float: none;
    width: 32px;
}
/deep/.evo-pointer input
{
  border: none!important;
  margin: 0;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    width: 0;
}
</style>