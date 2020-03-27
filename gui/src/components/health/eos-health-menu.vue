/*****************************************************************************
 Filename:          eos-health-menu.vue
 Description:       Health menu component.

 Creation Date:     14/03/2020
 Author:            Piyush Gupte

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div class="eos-p-2">
    <div
      v-for="menuItem in healthData"
      :key="Object.keys(menuItem)[0]"
      class="eos-menu-card-layout"
    >
      <div>
        <label class="eos-text-lg eos-text-bold eos-menu-card-title">{{Object.keys(menuItem)[0]}}</label>
        <button
          type="button"
          class="eos-btn-tertiary eos-float-r"
          @click="$router.push({ name: 'healthview', query: { name: Object.keys(menuItem)[0] }})"
        >View</button>
      </div>
      <div>
        <div
          class
        >Healthy:{{ menuItem[Object.keys(menuItem)[0]].health_summary.good?menuItem[Object.keys(menuItem)[0]].health_summary.good:0}}</div>
        <div
          class
        >Degraded:{{ menuItem[Object.keys(menuItem)[0]].health_summary.degraded?menuItem[Object.keys(menuItem)[0]].health_summary.degraded:0}}</div>
        <div
          class
        >Faulty:{{ menuItem[Object.keys(menuItem)[0]].health_summary.fault?menuItem[Object.keys(menuItem)[0]].health_summary.fault:0}}</div>
      </div>
    </div>
  </div>
</template>
 <script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Api } from "./../../services/api";
import apiRegister from "./../../services/api-register";
import { AlertObject } from "../../models/alert";

@Component({
  name: "eos-health-submenu"
})
export default class EosHealthSubmenu extends Vue {
  public alertObject: AlertObject = {} as AlertObject;
  public menuList: string[] = [];
  public healthData: any = {};

  public async mounted() {
    try {
      this.$store.dispatch("systemConfig/showLoaderMessage", {
        show: true,
        message: "Getting node health info..."
      });
      const res = await Api.getAll(apiRegister.node_health);
      this.$store.dispatch("systemConfig/hideLoader");
      if (res && res.data) {
        this.healthData = res.data;
        for (let count = 0; count <= res.data.length - 1; count++) {
          const menu = Object.keys(res.data[count]);
          this.menuList.push(menu[0]);
        }
      }
    } catch {
      this.$store.dispatch("systemConfig/hideLoader");
    }
  }
}
</script>
<style lang="scss" scoped>
.eos-menu-card-layout {
  height: 7.25em;
  width: 56.25em;
  padding-left: 1em;
  padding-top: 0.5em;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.eos-menu-card-title {
  margin-top: 0.313em;
}
</style>
