<!--
* CORTX-CSM: CORTX Management web.
* Copyright (c) 2022 Seagate Technology LLC and/or its Affiliates
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
* please email opensource@seagate.com.
-->
<template>
  <v-app>
    <LrHeader @menu-click="drawer = !drawer" />
    <main>
      <nav class="side-nav">
        <LrNavigationDrawer :drawer.sync="drawer" />
      </nav>
      <div class="main-content">
        <LrBreadCrumb />
        <LrRouteComponents />
      </div>
    </main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LrHeader from "./components/LrHeader.vue";
import LrNavigationDrawer from "./components/LrNavigationDrawer.vue";
import LrRouteComponents from "./components/LrRouteComponents.vue";
import LrBreadCrumb from "./components/bread-crumb/LrBreadCrumb.vue";

@Component({
  name: "App",
  components: {
    LrHeader,
    LrNavigationDrawer,
    LrBreadCrumb,
    LrRouteComponents,
  },
})
export default class App extends Vue {
  drawer = true;
}
</script>
<style lang="scss" scoped>
@import url("./scss/style.scss");

main {
  display: flex;
  height: calc(100vh - 60px);
  .side-nav {
    width: 50px;
    height: 100%;
    background-color: #e7e7e7;

    .side-nav-title {
      text-align: center;
      font-weight: bold;
      position: relative;
      top: 50%;
    }
  }

  .main-content {
    background-color: #f7f7f7;
    overflow: auto;
    width: 100%;
    padding: 1em 2em;
  }
}
</style>
