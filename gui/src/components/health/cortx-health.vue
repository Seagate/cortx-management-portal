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
  <div class="cortx-p-1">
    <cortx-tabs :tabsInfo="tabsInfo" />
      <CortxHealthGraphical v-if="showGraphTab" />
      <CortxHealthTabular v-if="showTableTab" />
  </div>
</template>
<script lang="ts">
import CortxTabs, { TabsInfo } from "../widgets/cortx-tabs.vue";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import CortxHealthTabular from "./cortx-health-tabular.vue";
import CortxHealthGraphical from "./cortx-health-graphical.vue";

@Component({
  name: "cortx-health",
  components: {
    CortxTabs,
    CortxHealthGraphical,
    CortxHealthTabular
  }
})
export default class CortxHealthNew extends Vue {
  public tabsInfo: TabsInfo = {
    tabs: [
      {
        id: 1,
        label: "Graphical",
        show: true,
        requiredAccess: "health"
      },
      {
        id: 2,
        label: "Tabular",
        show: true,
        requiredAccess: "health"
      }
    ],
    selectedTab: 1
  };
  private showGraphTab: boolean = true;
  private showTableTab: boolean = false;
  
  @Watch("tabsInfo.selectedTab")
  public onPropertyChanged(value: number, oldValue: number) {
    switch (value) {
      case 1:
        this.showGraphTab = true;
        this.showTableTab = false;
        break;
      case 2:
        this.showGraphTab = false;
        this.showTableTab = true;
        break;
    }
  }
}
</script>
<style lang="scss" scoped>
</style>