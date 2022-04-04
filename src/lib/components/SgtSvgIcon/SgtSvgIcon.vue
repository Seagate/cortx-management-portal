<!--
* CORTX-CSM: CORTX Management web.
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
* please email opensource@seagate.com.
-->
<template>
  <div
    class="sgt-icon-container"
    :class="[disableClick || disabled ? '' : 'cursor-pointer']"
  >
    <v-tooltip left :disabled="!tooltip">
      <template v-slot:activator="{ on, attrs }">
        <div
          v-if="icon"
          :class="[hoverIcon ? 'action-btn' : '', { disabled }]"
          v-bind="attrs"
          v-on="on"
        >
          <img
            :src="require(`@/assets/icons/${icon}`)"
            @click="$emit('click')"
            class="action-btn-block"
            alt="logo"
          />
          <img
            v-if="hoverIcon"
            :src="require(`@/assets/icons/${hoverIcon}`)"
            @click="$emit('click')"
            class="action-btn-hover"
            alt="logo"
          />
        </div>
      </template>
      <span>{{ tooltip }}</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "SgtSvgIcon",
  components: {},
})
export default class SgtSvgIcon extends Vue {
  @Prop({ required: true }) private icon: string;
  @Prop({ required: false }) private hoverIcon: string;
  @Prop({ required: false }) private tooltip: string;
  @Prop({ required: false, default: false }) private disabled: boolean;
  @Prop({ required: false, default: false }) private disableClick: boolean;
}
</script>

<style lang="scss">
.sgt-icon-container {
  display: inline-block;
  &.cursor-pointer {
    cursor: pointer;
  }
  .disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}
.action-btn {
  .action-btn-block {
    display: block;
  }
  .action-btn-hover {
    display: none;
  }
}
.action-btn:hover {
  .action-btn-block {
    display: none;
  }
  .action-btn-hover {
    display: block;
  }
}
</style>
