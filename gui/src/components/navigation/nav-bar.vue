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
      :to="navItems[0].path"
      tag="div"
      class="eos-nav-item"
      active-class="eos-nav-item-active"
      :key="navItems[0].title"
    >
      <img class="eos-nav-item-icon-default" :src="navItems[0].iconDefault" />
      <img class="eos-nav-item-icon-active" :src="navItems[0].iconActive" />
      <label>{{ navItems[0].title }}</label>
    </router-link>
    <router-link
      :to="navItems[1].path"
      tag="div"
      class="eos-nav-item"
      active-class="eos-nav-item-active"
      :key="navItems[1].title"
    >
      <div style="padding: 5px;">
        <img class="eos-nav-item-icon-default" :src="navItems[1].iconDefault" />
        <img class="eos-nav-item-icon-active" :src="navItems[1].iconActive" />
      </div>
      <label>{{ navItems[1].title }}</label>
    </router-link>
    <router-link
      :to="navItems[2].path"
      tag="div"
      class="eos-nav-item"
      active-class="eos-nav-item-active"
      :key="navItems[2].title"
    >
      <img class="eos-nav-item-icon-default" :src="navItems[2].iconDefault" />
      <img class="eos-nav-item-icon-active" :src="navItems[2].iconActive" />
      <label>{{ navItems[2].title }}</label>
    </router-link>
    <router-link
      :to="navItems[3].path"
      tag="div"
      class="eos-nav-item"
      active-class="eos-nav-item-active"
      :key="navItems[3].title"
      event=""
    >
      <div style="padding: 5px;">
        <img class="eos-nav-item-icon-default" :src="navItems[3].iconDefault" />
        <img class="eos-nav-item-icon-active" :src="navItems[3].iconActive" />
      </div>
      <label>{{ navItems[3].title }}</label>
    </router-link>
    <router-link
      :to="navItems[4].path"
      tag="div"
      class="eos-nav-item"
      active-class="eos-nav-item-active"
      :key="navItems[4].title"
    >
      <div v-if="alertNotifications.alertCount > 0">
        <img class="eos-nav-item-icon-default" :src="navItems[4].iconDefaultWithNotification" />
        <img class="eos-nav-item-icon-active" :src="navItems[4].iconActiveWithNotification" />
      </div>
      <div v-else>
        <img class="eos-nav-item-icon-default" :src="navItems[4].iconDefault" />
        <img class="eos-nav-item-icon-active" :src="navItems[4].iconActive" />
      </div>
      <label>{{ navItems[4].title }}</label>
    </router-link>
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
      iconDefault: require('@/assets/navigation/dashboard-grey.svg'),
      iconActive: require('@/assets/navigation/dashboard-white.svg')
    },
    {
      title: "Provisioning",
      path: "/provisioning",
      iconDefault: require('@/assets/navigation/provisioning-grey.svg'),
      iconActive: require('@/assets/navigation/provisioning-white.svg')
    },
    {
      title: "Settings",
      path: "/settings",
      iconDefault: require('@/assets/navigation/settings-grey.svg'),
      iconActive: require('@/assets/navigation/settings-white.svg')
    },
    {
      title: "Maintenance",
      path: "/maintenance",
      iconDefault: require('@/assets/navigation/maintenance-grey.svg'),
      iconActive: require('@/assets/navigation/maintenance-white.svg')
    },
    {
      title: "Alerts",
      path: "/alerts",
      iconDefault: require('@/assets/navigation/alerts-grey.svg'),
      iconActive: require('@/assets/navigation/alerts-white.svg'),
      iconDefaultWithNotification: require('@/assets/navigation/alerts-dot-grey.svg'),
      iconActiveWithNotification: require('@/assets/navigation/alerts-dot-white.svg')
    }
  ];

  get alertNotifications() {
    return this.$store.state.alertNotification.socket;
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
