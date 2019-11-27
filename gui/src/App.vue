/*****************************************************************************
 Filename:          alert-medium.vue
 Description:       Alert Medium Component

 Creation Date:     01/08/2019
 Author:            Piyush Gupte

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <v-app style="background-color: #FFF;">
    <div class="full-view" v-if="!onboardingStatus">
      <router-view></router-view>
    </div>

    <div class="main-view" v-if="onboardingStatus">
      <headerBar />
      <div class="container pa-0 ma-0">
        <div class="d-inline-block display-nav">
          <eos-nav-bar></eos-nav-bar>
        </div>
        <div class="d-inline-block display-container px-2 pt-6 pb-2 col-10">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HeaderBar from "./components/header/header-bar.vue";
import EosNavBar from "./components/navigation/nav-bar.vue";
@Component({
  name: "App",
  components: {
    headerBar: HeaderBar,
    eosNavBar: EosNavBar
  }
})
export default class App extends Vue {
  get onboardingStatus() {
    return this.$store.getters["alerts/onboardingStatus"];
  }
}
</script>

<style lang="scss" scoped>
.full-view {
  position: relative;
  height: 99.9%;
  padding: 0px;
}
.main-view {
  position: relative;
  top: 4em;
  padding: 0px;
  background-color: #FFF;
}
.container {
  height: 100%;
  padding: 0px;
}
.display-container {
  position: absolute;
  left: 13.5em;
}
.display-nav {
  padding-top: 0.2em;
  height: 100%;
  position: fixed;
}
</style>
