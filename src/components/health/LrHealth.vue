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
  <div class="health-page-container">
    <LrCalulateDimensions />
    <SgtTabs :tabsInfo="tabsInfo" @selected="onTabChange" />
    <component :is="activeTab" />
  </div>
</template>
<script lang="ts">
import SgtTabs, { TabsInfo } from "../shared/SgtTabs.vue";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
// import LrHealthTabular from "./LrHealthTabular.vue";
import LrHealthGraphical from "./LrHealthGraphical.vue";
import LrCalulateDimensions from "../LrCalulateDimensions.vue";
import Tab1 from "./Tab1.vue";
import Tab2 from "./Tab2.vue";

@Component({
  name: "LrHealth",
  components: {
    SgtTabs,
    LrHealthGraphical,
    LrCalulateDimensions,
    // LrHealthTabular,
    Tab1,
    Tab2,
  },
})
export default class LrHealth extends Vue {
  public tabsInfo: TabsInfo = [
    {
      id: 1,
      label: "Graphical",
    },
    {
      id: 2,
      label: "Tabular",
    },
  ];
  // private activeTab = "Tab1";
  private activeTab = "LrHealthGraphical";

  public onTabChange(value: number) {
    switch (value) {
      case 1:
        // this.activeTab = "Tab1";
        this.activeTab = "LrHealthGraphical";
        break;
      case 2:
        this.activeTab = "Tab2";
        // this.activeTab = "LrHealthTabular";
        break;
    }
  }
}
</script>
<style lang="scss" scoped></style>
