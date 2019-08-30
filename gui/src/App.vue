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
import HeaderBar from "./components/header/header-bar.vue";
import EosNavBar from "./components/navigation/nav-bar.vue";
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
