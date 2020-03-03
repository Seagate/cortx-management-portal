/*****************************************************************************
 Filename:          eos-default.vue
 Description:       default "/" route handler

 Creation Date:     31/12/2019
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div>
    <header-bar />
    <div class="header-margin" v-if="isRouterPathOnboading">
      <router-view></router-view>
    </div>
    <div v-else>
      <eos-nav-bar />
      <div class="header-margin navbar-margin">
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
import EOSMessageDialog from "./widgets/eos-message-dialog.vue";

@Component({
  name: "Default",
  components: {
    HeaderBar,
    EosNavBar,
    EOSMessageDialog
  }
})
export default class EosDefault extends Vue {
  get isRouterPathOnboading() {
    return this.$route.name === "onboarding";
  }
}
</script>

<style lang="scss" scoped>
.header-margin {
  margin-top: 4em;
}
.navbar-margin {
  margin-left: 8.75em;
}
</style>
