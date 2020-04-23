<template>
  <section>
      <b-modal size="xl" :title="`Target: ${IUByName.target}`" hide-footer v-model="$parent.hideModal" id="special_modal">
        <h3 class="indicator-header">{{iusTitle}}</h3>
        <div style="display:flex;">
            <h3 v-if="targetValue" class="col15 col-md-4" style="margin:15px 0; font-weight:700;letter-spacing: 1px;"> &nbsp;TARGET:&nbsp;<span>{{targetValue.value}}</span><span>({{targetValue.period.name}})</span></h3>
          <div class="heat-tab col-md-7 d-flex justify-content-end" style="display:flex;margin:15px 0;">
              <div :key="ind" v-for="(legend, ind) in legends.slice(0,4)" class="col1"> <span   class="bar-types" :style="{color: legend.color , background: legend.color}" style="{background: #4FA9C7;padding: 2px; width: 10%; color: #4FA9C7;}">12</span> {{ range(legend) }}</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <MapTableArea :areaSelected="tableAreaSelected" @selected="setAreaSelected" :areas="areas" />
            <MapTablePeriod @selected="setPeriodSelected" :periods="newPeriods" :periodSelected="tablePeriodSelected" />
          </div>
       
        <div class="col-md-6 d-flex justify-content-end" style="display:flex;">
        <div class="col2" v-if="activeChart=='bar'"><img v-b-tooltip.hover title="Swap"  class="img-list" src="@/assets/images/swap.svg" style="width: 17px;cursor:pointer;" @click="swap=!swap"/></div>
        <div class="col2" ><img v-b-tooltip.hover title="Bar" @click="activeChart = 'bar'" class="img-list" src="@/assets/images/svg/web_icons-12.svg" style="width: 20px;cursor:pointer;" /></div>
        <div class="col2"><img @click="activeChart = 'line'" v-b-tooltip.hover title="Line"  class="img-list" src="@/assets/images/svg/line-chart.svg" style="width: 20px;cursor:pointer;" /></div>
        <div class="col2">
        <img v-b-tooltip.hover title="Table" @click="activeChart = 'table'"  class="img-list" src="@/assets/images/svg/tabel-chart.svg" style="width: 20px;cursor:pointer;" >
        </div>
         <div class="col2">
           <download-csv :data= "datasetForCSV" :name= "`${param.name.indicator}.csv`"> 
              <img @click="downloadToCSV()" v-b-tooltip.hover title="Download"  class="img-list" src="@/assets/images/svg/icons_download1.svg" style="width: 20px;cursor:pointer;" >
          </download-csv> 
 <!-- <img @click="downloadToCSV()" v-b-tooltip.hover title="Download"  class="img-list" src="@/assets/images/svg/icons_download1.svg" style="width: 20px;cursor:pointer;" > -->
        </div>
        </div>
        </div>
         <!-- <NoData v-if="Object.keys(dataset).length == 0"/> -->
        
        <div ref="tablebox" id="map_table" class="table_area_map">
          <keep-alive>
            <component @swap-chart="swapChart" :swap="swap" :param="param" :values="values" :dimension="dimension" :dataset="filteredData" :is="activeComponent" :periodSelected="tablePeriodSelected" :areaSelected="tableAreaSelected" :periods="newPeriods" />
          </keep-alive>
          
        </div>
        <div class="modal-footer">
          <b>{{ sources }}</b>
        </div>
      </b-modal>
  </section>
</template>

<script>
import {calculate_performance} from '@/statics/functions'

export default {
  name: "MapTable",
  props:['periodSelected','plannedPeriodSelected','hideModal','dataset', 'param', 'sourceList', 'IUByName','legends','targetValue','areaName','areas','periods'],
   data(){
    return {
      activeChart: 'loader',
      tableAreaSelected: [],
      tablePeriodSelected: null,
      dimension: null,
      defaultChart: 'table',
      values:[],
      swap: false
    }
  },
  components: {
    NoData: () => import("@/components/partials/NoData.vue"),
    MapTablePeriod: () => import('@/components/partials/map/MapTablePeriod.vue'),
    MapTableArea: () => import('@/components/partials/map/MapTableArea.vue'),
    BarChart: () => import('@/components/partials/map/BarChart.vue'),
    LineChart: () => import('@/components/partials/map/LineChart.vue'),
    MapTableView: () => import('@/components/partials/map/MapTableView.vue'),
  },
 computed : {
    sources(){
      return `Source: ${[...new Set(this.filteredData.map(d=>d.actual.source))].join(',')}`;
    },
    newPeriods(){
      return this.periods.filter(p=>p.value!=null);
    },
    tablePeriods(){
        return this.tablePeriodSelected?this.tablePeriodSelected:[this.newPeriods[0].value];
    },
    datasetForCSV(){
     var data = [];
     this.filteredData.forEach(d => {
       if(d.planned)
      this.tablePeriods.forEach(tp => 
      data.push(
        {
        'Area': d.area,
        'Indicator': this.param.name.indicator,
        'Unit': d.unit,
        'Subgroup': this.param.name.subgroup.name,
        'Source': d[tp].source,
        'Data Value': d.actual.value,
        'Time Period':tp,
        'Planned Period': d.planned.period.name,
        'Planned Value': d.planned.value
      })
     )})
     return data;
    },
    filteredData(){
      this.values = [];
      var data = [];
      JSON.parse(JSON.stringify(this.dataset)).filter(d=>this.tableAreaSelected.includes(d._id)).sort((a,b)=>{
        return this.areaName(a._id) > this.areaName(b._id)?0:-1;
      }).forEach(ar=>{
        var planned_data = (ar.target)?ar.planned.concat([ar.target]):ar.planned;
        var planned = (planned_data && planned_data.length > 0)?planned_data.find(p=>p.period.name==this.plannedPeriodSelected):null;
        
        if(!this.tablePeriodSelected){
          var actual = ar.actual[0];
        } else {
          var actual = ar.actual.filter(a=>this.tablePeriodSelected.includes(a.period.name));
        }

        if(ar._id != 'IND' && ar._id != 'IND023' && actual){
          if(actual.length){
            var obj = {area: this.areaName(ar._id), planned, high: ar.high, unit: ar.unit, actual: {value: null, source: null}}
            actual.forEach(a=>{
              obj.actual.value = a.value;
              obj.actual.source = a.source.en;
              var index = this.calculate_performance(obj);
              var color = this.indexColor(index);
              obj[a.period.name] = {value: a.value, index, color, source: a.source.en};
              obj['_cellVariants'] = { [a.period.name]: 'warning' }
              this.values.push(a.value);
            });
            data.push(obj);
          } else if(actual.value) {
            var obj = {area: this.areaName(ar._id), planned, high: ar.high, unit: ar.unit, actual: {value: null, source: null}}
            obj.actual.value = actual.value;
            obj.actual.source = actual.source.en;
            var index = this.calculate_performance(obj);
            var color = this.indexColor(index);
            obj[actual.period.name] = {value: actual.value, index, color,source: actual.source.en};
            obj['_cellVariants'] = { [actual.period.name]: 'test' }
            this.values.push(+actual.value);
            data.push(obj);
          }
        }
      });
      return data;
    },
    iusTitle(){
        return `${this.param.name.indicator} | ${this.param.name.unit} | ${this.param.name.subgroup.name}`;
    },
    activeComponent: function(){
      if(this.activeChart!='loader' && this.activeChart!='nodata')
      this.defaultChart = this.activeChart;

      switch (this.activeChart) {
        case 'bar':
          return () => import("@/components/partials/map/BarChart.vue");
          break;
        case 'line':
          return () => import("@/components/partials/map/LineChart.vue");
          break;
        case 'table':
          return () => import("@/components/partials/map/MapTableView.vue");
          break;
        case 'nodata':
          return () => import("@/components/partials/NoData.vue");
          break;
        default:
          return () => import("@/components/partials/Loader.vue");
      }
    }
  },
  watch: {
    periodSelected: function(newValue,oldValue){
      this.tablePeriodSelected = newValue?[newValue]:newValue;
    },
    activeChart: function(newValue,oldValue){
      if(!this.filteredData.length)
      this.activeChart = 'nodata';
    },
    filteredData: {
      handler(newValue,oldValue){
        if(newValue.length==0)
        this.activeChart = 'nodata';
        else
        this.activeChart = this.defaultChart;
      },
      deep: true
    }
  },
  mounted(){
    console.log(this.legends)
    this.tableAreaSelected = this.areas.map(d=>d.value);
    this.$root.$on('bv::modal::shown', (bvEvent, modalId) => {
      this.tablePeriodSelected = this.periodSelected?[this.periodSelected]:this.periodSelected;
      if(this.$refs.tablebox){
        this.dimension = this.$refs.tablebox.getBoundingClientRect();
        if(this.filteredData.length)
        this.activeChart = this.defaultChart;
        else
        this.activeChart = 'nodata';
      }
    })
  },
  methods: {
    swapChart(value){
      this.swap = value;
    },
      range(d){
            switch(d.label.toLowerCase()){
              case 'aspirant':
                  return `${d.label} (${d.from}-${d.to})`;
                  break;
              case 'performer':
                  return `${d.label} (${d.from}-${d.to})`;
                  break;
              case 'front runner':
                  return `${d.label} (${d.from}-${d.to})`;
                  break;
              case 'achiever':
                  return `${d.label} (> = ${d.to})`;
                  break;  
                  default:
                  return d.label   
            }
        },
    calculate_performance,
    setAreaSelected(value){
      this.tableAreaSelected = value;
    },
    setPeriodSelected(value){
      this.tablePeriodSelected = value;
    },
    indexColor(index){
      var color = '#ccc';
      this.legends.forEach((leg,leg_index)=>{
        switch (leg_index) {
          case 0:
            if(index <= leg.to)
            color = leg.color
            break;
          case 3:
            if(index >= leg.from)
            color = leg.color
            break;
          default :
            if(index >= leg.from && index <= leg.to)
            color = leg.color;
        }
      })
      return color;
    }
    /*
      exportToCSV() {
        var csv = [];
        var updatedataset = [];
        var filename = this.param.name.indicator + "_" + this.getDate() + ".csv";
        var headerList = [
          "AreaID",
          "AreaName",
          "TimePeriod",
          "Source",
          "Indicator",
          "Unit",
          "Subgroup",
          "DataValue",
        ];

        updatedataset = Object.keys(this.dataset).map((key, index) =>  ({
            areacode : escapeString(key),
            areaname : escapeString(this.areaName(key)),
            period : escapeString(this.dataset[key].actual.period.name),
            source : escapeString(this.sourceList),
            indicator: escapeString(this.param.name.indicator),
            unit: escapeString(this.param.name.unit),
            subgroup: escapeString(this.param.name.subgroup.name),
            value: escapeString(this.dataset[key].actual.value),
        }));

      var table = document.createElement("table");
      var tr = document.createElement("tr"); // Header row
      for (var j = 0; j < headerList.length; j++) {
        var th = document.createElement("th"); //column
        var text = document.createTextNode(headerList[j]); //cell
        th.appendChild(text);
        tr.appendChild(th);
      }
      table.appendChild(tr);
      for (var i = 0; i <= updatedataset.length - 1; i++) {
        var tr = document.createElement("tr"); // row
        for (var chartObj in updatedataset[i]) {
          var td = document.createElement("td"); //column
          var text = document.createTextNode(
            updatedataset[i][chartObj].toString().indexOf("|") > -1
            ? updatedataset[i][chartObj].split("|")[1]
            : updatedataset[i][chartObj]
          ); //cell
          td.appendChild(text);
          tr.appendChild(td);
          // }
        }
        table.appendChild(tr);
      }
    var rows = table.querySelectorAll("table tr");
      for (var i = 0; i < rows.length; i++) {
        var row = [],
        cols = rows[i].querySelectorAll("td, th");
        for (var j = 0; j < cols.length; j++) {
          row.push(cols[j].innerText);
        }
        csv.push(row.join(","));
      }
      this.download_csv(csv.join("\n"), filename);

      function escapeString(string) {
        return (typeof string) == "string" ? string
        .replace('"', "")
        .replace("'", "")
        .replace("\\/g", "\\")
        .replace(/^/, '"')
        .concat('"') : string
      }
      // temp data table ends
    },
    download_csv(csv, filename) {
      var csvFile;
      var downloadLink;
      csvFile = new Blob([csv], { type: "text/csv" });
      downloadLink = document.createElement("a");
      downloadLink.download = filename;
      downloadLink.href = window.URL.createObjectURL(csvFile);
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
      downloadLink.click();
    },
    getDate() {
      let d = new Date();
      let datestring =
        d.getDate() +
        "-" +
        (d.getMonth() + 1) +
        "-" +
        d.getFullYear() +
        " " +
        d.getHours() +
        ":" +
        d.getMinutes();
      return datestring.replace(":", ".");
    }*/
  },
}

</script>
<style scoped>
/deep/.modal-header
{
  padding: 0!important;
  border: none!important;
  /* height: 0!important; */
}
/deep/.modal-body
  {
  padding: 0;
  }
  /deep/.modal-content {
    width:100%!important;
}
/deep/.modal.fade button.close {
    border-radius: 50%;
    color: #fff;
    margin-left:0px;
    right: 5px;
    top: 5px;
}
.col1 {
    padding-right: 20px;
        font-size: 12px;
}
.col2 {
    padding:10px;
        
        /* position:absolute;
        float:right;
        right:30px; */
}
.no-data
{
    text-align: center;
    /* margin: 0% 0!Important; */
    padding: 5% 0 0 0;
    border-top: 1px solid #ccc;
    height: 15vh;
}
/deep/.modal-open .modal
{
  overflow: !important;
}
.col3 {
    padding-right: 20px;
        font-size: 12px;
         position:absolute;
        float:right;
        right:30px;
}
h3.col15
{
      font-size: 14px;
    opacity: .8;
    color:#000!important;
}
/deep/h3.indicator-header
{
   text-transform: none;
    font-size: 15px;
    font-weight: 100!important;
    color: #3c3a3a;
    background: #f5f5f5;
    padding: 8px 15px;
    font-weight: 400;
    display: block;
    width: 100%; 
    margin: 0;
    letter-spacing: 1px;
}
/deep/ h5.modal-title {
        /* text-transform: none;
    font-size: 16px;
    font-weight: 100!important;
    color: #3c3a3a;
    background: #f5f5f5;
    padding: 8px 15px;
    font-weight: 400;
    font-size: 18px;
    display: block;
    width: 100%; */
        margin: 0;
    letter-spacing: 1px;
    font-weight: 100;
    font-size: 13px;
     padding: 8px 15px;
}
/deep/.modal-header .close {
    background: #000!important;
    width: 45px!important;
    height: 30px!important;
    line-height: 30px!important;
    padding: 0!important;
    position: relative!important;
    z-index: 111!important;
    opacity: 1!important;
}
/deep/ .specific_map_table thead th:nth-child(1) {
    width: 33%;
}
/deep/ .specific_map_table thead th strong{
   font-size: 14px!important;
   font-weight: 600!important;
}
/deep/ .specific_map_table tbody td{
   font-size: 13px!important;
   font-weight: 100!important;
}
/* /deep/.specific_map_table tbody td:last-child
{
  background:cyan;
} */
#map_table
{
    height: 65vh;
    overflow: auto;
    margin:0 15px 15px 15px;
    
}
#map_table .table thead th
{
  position:sticky;
  top: -1px;
  background: #fff;
      box-shadow: inset 0 1px 0 #dee2e6, inset 0 -1px 0 #dee2e6;
}
#map_table::-webkit-scrollbar {
    width: 7px;
    height: 7px;
    background-color: #f5f5f5;
}
#map_table::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #c1c1c1;
}
.table
{
  margin-bottom: 0!important;
}






@media screen and (min-width: 1024px) and (max-width: 1380px)  {
  
    #map_table
{
      max-height: 62vh;
    overflow: auto;
    margin:0 15px 15px 15px;
    
}
  }
</style>