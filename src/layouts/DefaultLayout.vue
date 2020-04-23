<template>
<section id="default-layout">
<router-view />
</section>
</template>

<script>
export default {
  name: 'DefaultLayout',
};
</script>

<style scoped>
/deep/ {
    @import '../assets/css/style.css';
}
</style>
