<template>
<section class="labell" style=" position: absolute;background: #eaeaea;top: 325px;right: 90px;border: 1px solid #ccc;width: 10%;paddimg:10px;">
    <div >
        <h3>Label</h3>
        <div style="padding: 5px;">
           <b-form-checkbox  v-model="districtArea">Name</b-form-checkbox>
          <b-form-checkbox   v-model="districtValue">Data Value</b-form-checkbox>
        </div>
    </div>
</section>
</template>
<script>
export default {
    name: 'MapLabel', 
    props: ['hidenModal', 'dataValue', 'mapArea'],
    data(){
        return{
        }
    },
    computed: {
        districtValue: {
            get() {
				return this.dataValue;
			},
			set(value) {
				this.$parent.$emit('dataVal', value)
			},
           
        },
        districtArea: {
            get() {
				return this.mapArea;
			},
			set(value) {
				this.$parent.$emit('AreaVal', value)
			},
           
        },

    },
}
</script>
<style scoped>
h3
{
    font-size: 16px;
    font-weight: 200;
    text-align: left;
    letter-spacing: 1.1px !important;
    padding-top: 4px;
    margin: 0;
    background: #f5f5f5;
    padding-left: 16px;
    padding-bottom: 4px;
}
/deep/label {
    display: block !important;
    margin-bottom: 0;
    font-size: 15px;
    /* text-align: left; */
    position: absolute;
    z-index: 1;
    left: 25px;
    background: transparent;
    padding: 0px 10px;
    color: #656464;
}
/deep/.custom-control.custom-checkbox
{
    padding: 0!important;
}


</style>