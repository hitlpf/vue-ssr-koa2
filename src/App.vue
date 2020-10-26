<template>
  <div id="app">
    <router-link to="/bar">Goto Bar!</router-link> 
    <router-link to="/foo">Goto Foo!</router-link> 
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  // 服务端只经历beforeCreat和created
  beforeCreate() {
    console.log('App.vue beforeCreate');
  },

  created() {
    console.log('App.vue created');
  },

  beforeMount() {
    console.log('App.vue beforeMount');
  },

  mounted() {
    console.log('App.vue mounted');
  }
}
</script>
<style>
.search span {
    font-size: 24px;
    line-height: 32px;
    color: #19be6b
}
</style>
