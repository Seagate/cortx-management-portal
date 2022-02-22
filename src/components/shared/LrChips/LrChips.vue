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
    <v-chip-group :style="'max-width: ' + width">
      <v-chip
        outlined
        color="csmprimary"
        v-for="(chip, i) in chips"
        :key="i"
        :close="chip.required ? false : true"
        close-label="remove"
        @click="$emit('chip-click', chip)"
        @click:close="$emit('remove-chip', chip)"
        class="mr-2"
      >
        {{ chip.label }} : {{ chip.value }}
      </v-chip>
    </v-chip-group>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { LrFilterObject } from "./LrFilterObject.model";

@Component({
  name: "LrChips",
  components: {},
})
export default class LrChips extends Vue {
  @Prop({ required: true, default: [] }) private chips: LrFilterObject[];
  @Prop({ required: false, default: "100%" }) private width: string;
}
</script>

<style lang="scss"></style>
