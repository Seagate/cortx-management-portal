/*
* CORTX-CSM: CORTX Management web and CLI interface.
* Copyright (c) 2020 Seagate Technology LLC and/or its Affiliates
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU Affero General Public License for more details.
* You should have received a copy of the GNU Affero General Public License
* along with this program. If not, see <https://www.gnu.org/licenses/>.
* For any questions about this software or licensing,
* please email opensource@seagate.com or cortx-questions@seagate.com.
*/
<template>
  <div class="eos-nav">
    <div v-for="navItem in navItems" :key="navItem.title">
      <eos-has-access
        :to="
          $eosUserPermissions[navItem.requiredAccess] +
            (navItem.requiredSubAccess
              ? $eosUserPermissions[navItem.requiredSubAccess]
              : $eosUserPermissions.list)
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
    <div class="eos-nav-bottom" v-if="brandName">
      <div class="eos-brand-text">Powered by</div>
      <img class="eos-nav-item-icon-default eos-img-responsive"
        :src="require('@/assets/Cortx-logo-GRN.svg/')" />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-nav-bar"
})
export default class EosNavBar extends Vue {
  public brandName: boolean = false;
  public navItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      iconDefault: require("@/assets/navigation/dashboard-grey.svg"),
      iconActive: require("@/assets/navigation/dashboard-white.svg"),
      requiredAccess: "alerts"
    },
    {
      title: "Health",
      path: "/health",
      iconDefault: require("@/assets/navigation/health-grey.svg"),
      iconActive: require("@/assets/navigation/health-white.svg"),
      requiredAccess: "sysconfig"
    },
    {
      title: "Provisioning",
      path: "/provisioning",
      iconDefault: require("@/assets/navigation/provisioning-grey.svg"),
      iconActive: require("@/assets/navigation/provisioning-white.svg"),
      requiredAccess: "s3accounts"
    },
    {
      title: "UDX",
      path: "/udx",
      iconDefault: require("@/assets/navigation/udx-grey.svg"),
      iconActive: require("@/assets/navigation/udx-white.svg"),
      requiredAccess: "maintenance"
    },
    {
      title: "Settings",
      path: "/settings",
      iconDefault: require("@/assets/navigation/settings-grey.svg"),
      iconActive: require("@/assets/navigation/settings-white.svg"),
      requiredAccess: "maintenance"
    },
    {
      title: "Maintenance",
      path: "/maintenance",
      iconDefault: require("@/assets/navigation/maintenance-grey.svg"),
      iconActive: require("@/assets/navigation/maintenance-white.svg"),
      requiredAccess: "sysconfig"
    }
  ];

  public mounted() {
    this.brandName = process.env.VUE_APP_BRANDNAME !== "cortx";
  }

  get alertNotifications() {
    return this.$store.state.alertNotification.socket;
  }
}
</script>
<style lang="scss" scoped>
.eos-nav {
  position: fixed;
  top: 50px;
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

.eos-img-responsive {
  width: 100%;
  max-width: 100%;
  height: auto;
  padding: 5px;
}
.eos-brand-text {
  color: #6ebe49;
  margin: auto 5px;
}
.eos-nav-bottom {
  position: absolute;
  bottom: 10px;
  background-color: #000000;
}
</style>
