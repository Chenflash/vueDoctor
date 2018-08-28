<template>
  <div class="mf-loading-container">
    <p><img src="../../assets/load.gif"></p>
  </div>
</template>
<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'loading'
  export default {
    name: COMPONENT_NAME
  }
</script>
<style scope>
 .mf-loading-container p{
   width:100%;
   text-align:center;
}
  .mf-loading-container img{
    width: 20px;
      height: 20px;
      display: inline-block;
  }
</style>
