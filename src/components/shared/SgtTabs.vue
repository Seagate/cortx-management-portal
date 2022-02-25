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
  <ul class="cortx-tabs-container">
    <li
      class="cortx-tab"
      v-for="tab in tabsInfo"
      v-bind:key="tab.id"
      :id="`tab-${tab.id}`"
      :class="{ active: tab.id === selectedTab }"
      @click="tabChangeHandler(tab.id)"
    >
      {{ tab.label }}
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

export interface Tab {
  id: number;
  label: string;
}

export type TabsInfo = Array<Tab>;

@Component({
  name: "SgtTabs",
})
export default class SgtTabs extends Vue {
  @Prop({ required: true }) public tabsInfo: TabsInfo;
  selectedTab = this.tabsInfo[0].id;

  public tabChangeHandler(id: number) {
    this.selectedTab = id;
    this.$emit("selected", id);
  }
}
</script>
<style lang="scss" scoped>
.cortx-tabs-container {
  padding: 0;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  flex-wrap: nowrap;

  .cortx-tab {
    min-width: 173px;
    height: 35px;
    text-align: center;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 26px;
    color: rgba(0, 0, 0, 0.87);
    cursor: pointer;

    &:hover {
      border-bottom: 1px solid #454545;
    }

    &.active {
      font-weight: bold;
      border-bottom: 4px solid #6ebe49;
    }
  }
}
</style>
