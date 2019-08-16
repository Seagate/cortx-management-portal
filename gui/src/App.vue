<template>
  <v-app>
    <headerBar />
    <div class="main-view">
      <router-view></router-view>
    </div>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HeaderBar from "./components/header/HeaderBar.vue";

@Component({
  name: "App",
  components: {
    headerBar: HeaderBar
  }
})
export default class App extends Vue {}
</script>

<style lang="scss" scoped>
.main-view{
  position: relative;
  top:80px;
}

</style>

