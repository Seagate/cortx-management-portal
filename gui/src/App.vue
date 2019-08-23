<template>
  <v-app>
    <headerBar />
    <div class="main-view">
      <v-row>
        <v-col cols=2>
          <eos-nav-bar></eos-nav-bar>
        </v-col>
        <v-col cols=10>
          <router-view></router-view>
        </v-col>
      </v-row>
    </div>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HeaderBar from "./components/header/HeaderBar.vue";
import EosNavBar from "./components/navigation/NavBar.vue";
@Component({
  name: "App",
  components: {
    headerBar: HeaderBar,
    eosNavBar: EosNavBar
  }
})
export default class App extends Vue {}
</script>

<style lang="scss" scoped>
.main-view {
  position: relative;
  top: 57px;
}
</style>
