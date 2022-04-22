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
  <div>
    <router-view v-if="isDashboard" />
    <v-card class="wrapper-card" v-else>
      <router-view />
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

@Component({
  name: "LrRouteComponents",
})
export default class LrRouteComponents extends Vue {
  public isDashboard = this.getIsDashboard();

  public getIsDashboard() {
    return this.$route.path === "/dashboard";
  }

  @Watch("$route")
  public routeChangeHandler() {
    this.isDashboard = this.getIsDashboard();
  }
}
</script>
<style lang="scss" scoped>
.wrapper-card {
  background: #ffffff;
  box-shadow: 0px 2px 0px #e5e5e5 !important;
  border-radius: 4px;
  padding: 15px;
}
</style>
