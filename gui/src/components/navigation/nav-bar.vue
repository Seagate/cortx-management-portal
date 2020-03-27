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
    <div v-for="navItem in navItems" :key="navItem.title">
      <eos-has-access
        :to="
          $eosUserPermissions[navItem.requiredAccess] + $eosUserPermissions.list
        "
      >
        <router-link
          :to="navItem.path"
          tag="div"
          class="eos-nav-item"
          active-class="eos-nav-item-active"
          :key="navItem.title"
        >
          <img class="eos-nav-item-icon-default" :src="navItem.iconDefault" />
          <img class="eos-nav-item-icon-active" :src="navItem.iconActive" />
          <label>{{ navItem.title }}</label>
        </router-link>
      </eos-has-access>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-nav-bar"
})
export default class EosNavBar extends Vue {
  public navItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      iconDefault: require("@/assets/navigation/dashboard-grey.svg"),
      iconActive: require("@/assets/navigation/dashboard-white.svg"),
      requiredAccess: "alerts"
    },
    {
      title: "Alerts",
      path: "/alerts",
      iconDefault: require("@/assets/navigation/alerts-grey.svg"),
      iconActive: require("@/assets/navigation/alerts-white.svg"),
      requiredAccess: "alerts"
    },
    {
      title: "Provisioning",
      path: "/provisioning",
      iconDefault: require("@/assets/navigation/provisioning-grey.svg"),
      iconActive: require("@/assets/navigation/provisioning-white.svg"),
      requiredAccess: "s3accounts"
    },
    {
      title: "Health",
      path: "/health",
      iconDefault: require("@/assets/navigation/health-grey.svg"),
      iconActive: require("@/assets/navigation/health-white.svg"),
      requiredAccess: "s3accounts"
    },
    {
      title: "UDX",
      path: "/udx",
      iconDefault: require("@/assets/navigation/udx-grey.svg"),
      iconActive: require("@/assets/navigation/udx-white.svg"),
      requiredAccess: "sysconfig"
    },
    {
      title: "Settings",
      path: "/settings",
      iconDefault: require("@/assets/navigation/settings-grey.svg"),
      iconActive: require("@/assets/navigation/settings-white.svg"),
      requiredAccess: "users"
    },
    {
      title: "Maintenance",
      path: "/maintenance",
      iconDefault: require("@/assets/navigation/maintenance-grey.svg"),
      iconActive: require("@/assets/navigation/maintenance-white.svg"),
      requiredAccess: "users"
    }
  ];

  get alertNotifications() {
    return this.$store.state.alertNotification.socket;
  }
}
</script>
<style lang="scss" scoped>
.eos-nav {
  position: fixed;
  top: 4em;
  left: 0;
  bottom: 0;
  z-index: 5;
  width: 8.75em;
  padding-top: 0.75em;
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
.eos-nav-item > label {
  margin-left: 5px;
  cursor: pointer;
}
.eos-nav-item-active {
  background: #454545 !important;
  color: #ffffff !important;
}
.eos-nav-item-icon-default {
  display: block;
}
.eos-nav-item.eos-nav-item-active .eos-nav-item-icon-default {
  display: none;
}
.eos-nav-item-icon-active {
  display: none;
}
.eos-nav-item.eos-nav-item-active .eos-nav-item-icon-active {
  display: block;
}
</style>
