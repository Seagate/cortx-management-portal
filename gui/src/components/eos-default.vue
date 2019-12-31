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
  <div class="main-view">
    <header-bar />
    <div class="container pa-0 ma-0">
      <div class="d-inline-block display-nav">
        <eos-nav-bar></eos-nav-bar>
      </div>
      <div class="d-inline-block display-container px-2 pt-6 pb-2 mr-5">
        <router-view></router-view>
      </div>
    </div>
    <EOSMessageDialog />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HeaderBar from "./header/header-bar.vue";
import EosNavBar from "./navigation/nav-bar.vue";
import { SystemConfigObject } from "../models/system-configuration";
import Loader from "./widgets/loader.vue";
import EOSMessageDialog from "./widgets/eos-message-dialog.vue";

@Component({
  name: "Default",
  components: {
    HeaderBar,
    EosNavBar,
    Loader,
    EOSMessageDialog
  }
})
export default class EosDefault extends Vue {}
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
  background-color: #fff;
}
.container {
  height: 100%;
  padding: 0px;
}
.display-container {
  position: absolute;
  left: 9.8em;
  width: 90%;
}
.display-nav {
  padding-top: 0.2em;
  height: 100%;
  position: fixed;
}
</style>
