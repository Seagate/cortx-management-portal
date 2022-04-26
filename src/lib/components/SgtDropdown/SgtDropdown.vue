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
  <v-select
    :items="dropdownOptions"
    :label="label"
    :placeholder="placeholder"
    :item-text="itemText"
    :item-value="itemValue"
    :height="height"
    v-model="selectedValue"
    append-icon="mdi-chevron-down"
    item-color="primary"
    outlined
    dense
    v-on="$listeners"
  ></v-select>
</template>
<script lang="ts">
import { Component, Vue, Prop, ModelSync } from "vue-property-decorator";
@Component({
  name: "SgtDropdown",
})
export default class SgtDropdown extends Vue {
  @Prop({ required: true }) private dropdownOptions: any;
  @ModelSync("selected", "change") readonly selectedValue: any;
  @Prop({ required: false }) private label: string;
  @Prop({ required: false }) private placeholder: string;
  @Prop({ required: false, default: "label" }) private itemText: string;
  @Prop({ required: false, default: "value" }) private itemValue: string;
  @Prop({ required: false, default: false }) private valueAsObject: boolean;
  @Prop({ required: false }) private height: string;
}
</script>
<style lang="scss" scoped>
</style>