/*****************************************************************************
 Filename:          App.vue
 Description:       App Component

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
    <router-view></router-view>
    <loader :show="showLoader" :message="loaderMessage" />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Loader from "./components/widgets/loader.vue";

@Component({
  name: "App",
  components: {
    Loader
  }
})
export default class App extends Vue {
  get showLoader() {
    return this.$store.getters["systemConfig/showLoaderStatus"];
  }
  get loaderMessage() {
    return this.$store.getters["systemConfig/loaderMessageText"];
  }
}
</script>

<style lang="scss" scoped></style>
