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
  <v-tooltip bottom max-width="300">
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on">
        <v-icon
          v-if="!$slots.icon"
          color="csmprimary"
          v-bind="attrs"
          v-on="on"
          small
          >mdi-information</v-icon
        >
        <slot name="icon" />
      </div>
    </template>
    <span><slot /></span>
  </v-tooltip>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "SgtTooltipIcon",
})
export default class SgtTooltipIcon extends Vue {}
</script>

<style lang="scss" scoped>
.i-button-container {
  position: relative;

  svg {
    cursor: pointer;
  }

  .i-info-container {
    min-width: 250px;
    padding: 0.5em 1em;
    background-color: #454545;
    color: white;
    position: absolute;
    top: 30px;
    left: -20px;
    border-radius: 4px;
    z-index: 10;

    .upward-pointer {
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-bottom: 8px solid #454545;
      position: absolute;
      top: -8px;
      left: 21px;
    }
  }
}
</style>
