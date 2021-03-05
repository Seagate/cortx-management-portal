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
  <div class="cortx-dropdown-container" tabindex="1" @blur="isMenuOpen = false" :style="{ width: width }">
    <div :class="['cortx-dropdown-title', isMenuOpen ? 'cortx-dropdown-title-active' : '']" @click="isMenuOpen = !isMenuOpen">
      <span class="cortx-text-md cortx-float-l cortx-dropdown-title-text">{{ selectedOption && selectedOption.label ? selectedOption.label : title }}</span>
      <img v-if="isMenuOpen" class="cortx-float-r ml-2" :src="require('@/assets/caret-up.svg')" id="opendropdown" />
      <img v-else class="cortx-float-r ml-2" :src="require('@/assets/caret-down.svg')"  id="closedropdown"/>
    </div>
    <div class="cortx-dropdown-menu" v-show="isMenuOpen">
      <div
        :class="['cortx-dropdown-menu-item', selectedOption && selectedOption.value === option.value ? 'selected' : '']"
        v-for="option in options"
        :key="option.value"
        @click="onMenuItemSelect(option)"
        :id="option.label"
      >
        <span class="cortx-text-md cortx-dropdown-menu-item-text">{{
          option.label
        }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { CortxDropdownOption } from "./cortx-dropdown";

@Component({
  name: "cortx-dropdown"
})
export default class CortxDropdown extends Vue {
  @Prop()
  public selectedOption: CortxDropdownOption;

  @Prop({ required: false, default: "-- Select --" })
  public title: string;

  @Prop({ required: true })
  public options: CortxDropdownOption[];

  @Prop({ required: false, default: "325px" })
  public width: string;

  public isMenuOpen: boolean = false;

  public onMenuItemSelect(selectedOption: CortxDropdownOption) {
    this.$emit("update:selectedOption", selectedOption);
    this.isMenuOpen = false;
  }
}
</script>
<style lang="scss" scoped>
.cortx-dropdown-container {
  display: inline-block;
  outline: none;
  position: relative;
  height: 40px;
}
.cortx-dropdown-title {
  display: inline-block;
  background: #ffffff;
  border: 1px solid #b7b7b7;
  border-radius: 4px;
  padding: 0.5em 0.625em 0.375em 1em;
  cursor: pointer;
  width: 100%;
}
.cortx-dropdown-title:hover {
  background: #fafafa;
  border-color: #9e9e9e;
}
.cortx-dropdown-title-active {
  background: #ffffff;
  border-color: #6ebe49;
}
.cortx-dropdown-title-text {
  margin-top: 0.188em;
  font: inherit;
}
.cortx-dropdown-menu {
  position: absolute;
  background: #ffffff;
  width: inherit;
  max-height: 188px;
  box-shadow: 8px 6px 8px rgba(0, 0, 0, 0.12);
  z-index: 4;
  border: 1px solid #6ebe49;
  box-sizing: border-box;
  border-radius: 4px;
  overflow: auto;
  margin-top: -6px;
}
.cortx-dropdown-menu-item {
  width: 100%;
  min-height: 36px;
  padding-top: 4px;
  padding-left: 0.625em;
  padding-right: 0.625em;
  cursor: pointer;
}
.cortx-dropdown-menu-item:hover {
  background: rgba(0, 0, 0, 0.02);
}
.cortx-dropdown-menu-item.selected {
  background: rgba(0, 0, 0, 0.02);
}
.cortx-dropdown-menu-item-text {
  font: inherit;
}
</style>
