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
  <div class="toggle-wrapper" :class="{ disabled: disabled }">
    <span class="label" v-if="label">{{ label }}</span>
    <v-tooltip right :disabled="!tooltip">
      <template v-slot:activator="{ on, attrs }">
        <div
          class="toggle-container"
          :class="{ active: value }"
          @click="$emit('change', !value)"
          v-bind="attrs"
          v-on="on"
        >
          <div class="toggle-bubble">
            <div class="off-bubble"></div>
          </div>
        </div>
      </template>
      <span>{{ tooltip }}</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model } from "vue-property-decorator";
@Component({
  name: "SgtToggle",
})
export default class SgtToggle extends Vue {
  @Prop({ required: false }) private disabled: boolean;
  @Prop({ required: false }) private label: string;
  @Prop({ required: false, default: "" }) private tooltip: string;
  @Model("change", { type: Boolean }) readonly value!: boolean;
}
</script>

<style lang="scss" scoped>
.toggle-wrapper {
  display: flex;
  align-items: center;
}
.toggle-wrapper.disabled {
  opacity: 0.5;
  pointer-events: none;
}
.toggle-wrapper .label {
  margin-right: 5px;
}
.toggle-container {
  height: 16px;
  width: 32px;
  border-radius: 8px;
  border: 2px solid #9e9e9e;
  position: relative;
  cursor: pointer;
}
.toggle-container:hover {
  border-color: #454545;
}
.toggle-container:hover .toggle-bubble {
  background-color: #454545;
}
.toggle-bubble {
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background-color: #9e9e9e;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 3px;
  transition: left 150ms linear;
}
.off-bubble {
  height: 3px;
  width: 3px;
  background-color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
div.toggle-container.active {
  border-color: $primary;
}
div.toggle-container.active .toggle-bubble {
  left: calc(100% - 11px);
  background-color: $primary !important;
}
.active .off-bubble {
  display: none;
}
</style>