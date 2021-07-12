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
  <div class="cortx-nav">
    <div v-for="navItem in navItems" :key="navItem.title">
      <cortx-has-access
        :to="
          $cortxUserPermissions[navItem.requiredAccess] +
            (navItem.requiredSubAccess
              ? $cortxUserPermissions[navItem.requiredSubAccess]
              : $cortxUserPermissions.list)
        "
      >
        <v-tooltip right max-width="300"
          v-feature="navItem.featureId">
          <template v-slot:activator="{ on }">
            <router-link
              :to="navItem.path"
              tag="div"
              class="cortx-nav-item"
              active-class="cortx-nav-item-active"
              :key="navItem.title"
            >
              <img v-on="on" class="cortx-nav-item-icon-default" :src="navItem.iconDefault" />
              <img v-on="on" class="cortx-nav-item-icon-active" :src="navItem.iconActive" />
              <label v-on="on" :id="navItem.title">{{ navItem.title }}</label>
            </router-link>
          </template>
          <span :id="navItem.title">{{ navItem.title }}</span>
        </v-tooltip>
      </cortx-has-access>
    </div>
    <div class="cortx-nav-bottom" v-if="brandName">
      <div class="cortx-brand-text">{{ $t("common.poweredBy") }}</div>
      <img
        class="cortx-nav-item-icon-default cortx-img-responsive"
        :src="require('@/assets/Cortx-logo-GRN.svg/')"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import i18n from "../../i18n";
import { unsupportedFeatures } from "../../common/unsupported-feature";

@Component({
  name: "cortx-nav-bar"
})
export default class CortxNavBar extends Vue {
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
      requiredAccess: "sysconfig",
      featureId: unsupportedFeatures.health
    },
    {
      title: "Manage",
      path: "/manage",
      iconDefault: require("@/assets/navigation/manage-grey.svg"),
      iconActive: require("@/assets/navigation/manage-white.svg"),
      requiredAccess: "s3accounts",
      featureId: unsupportedFeatures.manage
    },
    {
      title: "Lyve Pilot",
      path: "/ldp",
      iconDefault: require("@/assets/navigation/udx-grey.svg"),
      iconActive: require("@/assets/navigation/udx-white.svg"),
      requiredAccess: "lyve_pilot",
      featureId: unsupportedFeatures.lyve_pilot
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
    this.brandName = process.env.VUE_APP_BRANDNAME !== "CORTX";
    const vueInstance: any = this;
    if (
      !vueInstance.$hasAccessToCsm(
        vueInstance.$cortxUserPermissions.stats +
          vueInstance.$cortxUserPermissions.list
      ) &&
      vueInstance.$hasAccessToCsm(
        vueInstance.$cortxUserPermissions.s3accounts +
          vueInstance.$cortxUserPermissions.delete
      )
    ) {
      const foundIndex = this.navItems.findIndex(x => x.path === "/manage");
      this.navItems[foundIndex].path = "/manage/s3";
    }
  }

  get alertNotifications() {
    return this.$store.state.alertNotification.socket;
  }
}
</script>
<style lang="scss" scoped>
.cortx-nav {
  position: fixed;
  top: 60px;
  left: 0;
  bottom: 0;
  z-index: 5;
  width: 11.25em;
  background: #000000;
}
.cortx-nav-item {
  display: flex;
  flex-wrap: nowrap;
  background-color: #000000;
  color: #757575;
  height: 50px;
  align-items: center;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  padding-left: 20px;
  padding-right: 10px;
  border-left: 5px solid #000000;
  cursor: pointer;
}
.cortx-nav-item > label {
  margin-left: 10px;
  cursor: pointer;
}
.cortx-nav-item-active {
  background: #262626 !important;
  color: #ffffff !important;
  border-left: 5px solid #6EBE49;
}
.cortx-nav-item-icon-default {
  display: block;
}
.cortx-nav-item.cortx-nav-item-active .cortx-nav-item-icon-default {
  display: none;
}
.cortx-nav-item-icon-active {
  display: none;
}
.cortx-nav-item.cortx-nav-item-active .cortx-nav-item-icon-active {
  display: block;
}

.cortx-img-responsive {
  width: 100%;
  max-width: 100%;
  height: auto;
  padding: 5px 20px 30px 20px;
}
.cortx-brand-text {
  color: #6ebe49;
  margin: auto 5px;
  padding-left: 15px;
  font-size: 18px;
}
.cortx-nav-bottom {
  position: absolute;
  bottom: 10px;
  background-color: #000000;
}
</style>
