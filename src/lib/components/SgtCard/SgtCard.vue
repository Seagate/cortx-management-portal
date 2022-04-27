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
  <v-card class="card-container pa-3" :v-bind="$props" :v-on="$listeners">
    <div class="title-section">
      <p class="widget-title text-h6 font-weight-medium">{{ $t(title) }}</p>
      <SgtSvgIcon
        icon="zoom-in.svg"
        hoverIcon="zoom-in-hover.svg"
        tooltip="View"
        v-if="showZoomIcon"
        @click="$emit('zoom-click')"
      />
    </div>
    <slot></slot>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import SgtSvgIcon from "@/lib/components/SgtSvgIcon/SgtSvgIcon.vue";

@Component({
  name: "SgtCard",
  components: {
    SgtSvgIcon,
  },
})
export default class SgtCard extends Vue {
  @Prop({ required: true }) public title: string;
  @Prop({ required: false, default: false }) public showZoomIcon: boolean;
}
</script>

<style lang="scss" scoped>
.card-container {
  height: 100%;
  box-shadow: 1px 2px 10px #e5e5e5 !important;
}
.title-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.title-section .widget-title {
  margin: 0;
}
.title-section > .sgt-zoom-in-icon {
  height: 20px;
  width: 20px;
  cursor: pointer;
}
</style>
