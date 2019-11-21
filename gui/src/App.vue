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
  <v-app>
    <div class="full-view" v-if="!onboardingStatus">
      <router-view></router-view>
    </div>
    
    <div class="main-view" v-if="onboardingStatus">
      <headerBar />
      <v-row class="container">
        <v-col v-if="onboardingStatus" cols="2" class="pa-0">
          <eos-nav-bar></eos-nav-bar>
        </v-col>
        <v-col v-if="!onboardingStatus" cols="1" class="pa-0"></v-col>
        <v-col cols="10" class="pa-0">
          <router-view></router-view>
        </v-col>
        <v-col v-if="!onboardingStatus" cols="1"></v-col>
      </v-row>
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
  height: 93%;
  padding: 0px;
  background-color: #FFF;
}
.container {
  height: 100.1%;
  padding: 0px;
}
</style>
