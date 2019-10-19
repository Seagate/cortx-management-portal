<template>
  <div id="app">
    <C3-chart/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import C3Chart from './components/c3-chart.vue';

@Component({
  components: {
    C3Chart
  },
})
export default class App extends Vue {}
</script>

<style>
@import "../node_modules/c3/c3.min.css";
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
