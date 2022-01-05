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
  <div>
    <cortx-header @menu-click="drawer = !drawer" />
    <div>
      <cortx-navigation-drawer v-if="!isRouterPathOnboading" :drawer.sync="drawer" />
      <div class="header-margin navbar-margin">
        <router-view></router-view>
      </div>
    </div>
    <cortx-message-dialog />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CortxHeader from "./cortx-header.vue";
import { SystemConfigObject } from "../models/system-configuration";
import CortxMessageDialog from "./widgets/cortx-message-dialog.vue";
import CortxNavigationDrawer from "./cortx-navigation-drawer.vue";
@Component({
  name: "Default",
  components: {
    cortxHeader: CortxHeader,
    cortxMessageDialog: CortxMessageDialog,
    cortxNavigationDrawer: CortxNavigationDrawer
  }
})
export default class CortxDefault extends Vue {
  drawer: boolean = true;

  public mounted() {
    const dimensions = this.calculateDimensions();
    this.$store.commit("dimensions/setDimensions", dimensions);
  }

  get isRouterPathOnboading() {
    return this.$route.name === "onboarding";
  }

  private calculateDimensions() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const headerHeight = 50;
    const headerWidth = windowWidth;
    const navBarHeight = windowHeight - headerHeight;
    const navBarWidth = 60;

    return {
      window: {
        height: windowHeight,
        width: windowWidth
      },
      mainLayout: {
        headerBar: {
          height: headerHeight,
          width: headerWidth
        },
        navBar: {
          height: navBarHeight,
          width: navBarWidth
        },
        content: {
          height: navBarHeight,
          width: windowWidth - navBarWidth
        }
      }
    };
  }
}
</script>

<style lang="scss" scoped>
.header-margin {
  margin-top: 3.75em;
}
.navbar-margin {
  margin-left: 3.75em;
}
</style>
