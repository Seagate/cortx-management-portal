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
  <div class="cortx-tabs-container">
    <div
      v-for="tab in tabsInfo.tabs"
      v-bind:key="tab.id"
      v-if="tab.show"
      :id="tab.requiredAccess + 'tab'"
      :class="tab.id === tabsInfo.selectedTab ? 'cortx-tab-active' : 'cortx-tab'"
      @click="tabsInfo.selectedTab = tab.id"
    >
      {{ tab.label }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

export interface Tab {
  id: number;
  label: string;
  show: boolean;
  requiredAccess?: string;
}

export interface TabsInfo {
  tabs: Tab[];
  selectedTab: number;
}

@Component({
  name: "cortx-tabs"
})
export default class CortxTabs extends Vue {
  @Prop({ required: true })
  public tabsInfo: TabsInfo;
}
</script>
<style lang="scss" scoped>
.cortx-tabs-container {
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  flex-wrap: nowrap;
}
.cortx-tabs-container > div {
  min-width: 173px;
  height: 35px;
  text-align: center;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 26px;
  color: rgba(0, 0, 0, 0.87);
  cursor: pointer;
}
.cortx-tabs-container > div.cortx-tab-active {
  font-weight: bold;
  border-bottom: 4px solid #6ebe49;
}
.cortx-tabs-container > div.cortx-tab:hover {
  border-bottom: 1px solid #454545;
}
</style>
