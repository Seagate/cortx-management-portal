/*****************************************************************************
 Filename:          eos-tabs.vue
 Description:       Tabs widget Component

 Creation Date:     09/01/2019
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div class="eos-tabs-container">
    <div
      v-for="tab in tabsInfo.tabs"
      v-bind:key="tab.id"
      v-if="tab.show"
      :class="tab.id === tabsInfo.selectedTab ? 'eos-tab-active' : 'eos-tab'"
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
  name: "eos-tabs"
})
export default class EosTabs extends Vue {
  @Prop({ required: true })
  public tabsInfo: TabsInfo;
}
</script>
<style lang="scss" scoped>
.eos-tabs-container {
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  flex-wrap: nowrap;
}
.eos-tabs-container > div {
  min-width: 173px;
  height: 39px;
  text-align: center;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 26px;
  color: rgba(0, 0, 0, 0.87);
  cursor: pointer;
}
.eos-tabs-container > div.eos-tab-active {
  font-weight: bold;
  border-bottom: 4px solid #6ebe49;
}
.eos-tabs-container > div.eos-tab:hover {
  border-bottom: 1px solid #454545;
}
</style>
