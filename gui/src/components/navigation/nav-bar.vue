/*****************************************************************************
 Filename:          nav-bar.vue
 Description:       Navigation Component

 Creation Date:     30/08/2019
 Author:            Sanjeevan Bhave

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div class="eos-nav">
    <router-link
      :to="item.path"
      tag="div"
      class="eos-nav-item"
      active-class="eos-nav-item-active"
      v-for="item in items"
      :key="item.title"
    >
      <img :src="require('@/assets/navigation/' + item.icon)" />
      <label>{{ item.title }}</label>
    </router-link>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-nav-bar"
})
export default class EosNavBar extends Vue {
  private data() {
    return {
      items: [
        {
          title: "Dashboard",
          path: "/dashboard",
          icon: "dashboard-green.png"
        },
        {
          title: "Provisioning",
          path: "/provisioning",
          icon: "storage-green.png"
        },
        {
          title: "Settings",
          path: "/settings",
          icon: "settings-green.png"
        }
      ]
    };
  }
}
</script>
<style lang="scss" scoped>
.eos-nav {
  height: 100%;
  width: 140px;
  background: #000000;
}
.eos-nav-item {
  display: flex;
  flex-wrap: nowrap;
  background-color: #000000;
  color: #757575;
  height: 60px;
  align-items: center;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  padding-left: 10px;
  padding-right: 10px;
  cursor: pointer;
}
.eos-nav-item > img {
  height: 23px;
  width: 23px;
}
.eos-nav-item > label {
  margin-left: 10px;
  cursor: pointer;
}
.eos-nav-item-active {
  background: #454545 !important;
  color: #ffffff !important;
}
</style>
