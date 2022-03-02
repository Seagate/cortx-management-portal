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
  <ClickOutsideHOC @clicked-outside="isMenuOpen = false">
    <div
      class="sgt-dropdown-container"
      :class="{ 'menu-on-top': menuOnTop }"
      tabindex="1"
      @keyup.enter="isMenuOpen = !isMenuOpen"
      :style="{ minWidth: width }"
    >
      <div
        class="sgt-dropdown-title"
        :class="{ active: isMenuOpen }"
        @click="isMenuOpen = !isMenuOpen"
      >
        <span class="sgt-dropdown-title-text">
          {{
            selectedOption && selectedOption.label
              ? selectedOption.label
              : title
          }}
        </span>
        <img
          class="dropdown-icon ml-2"
          :class="{ active: isMenuOpen }"
          :src="require('@/assets/icons/caret-down.svg')"
        />
      </div>

      <div class="sgt-dropdown-menu" v-show="isMenuOpen">
        <div
          :class="[
            'sgt-dropdown-menu-item',
            selectedOption && selectedOption.value === option.value
              ? 'selected'
              : '',
          ]"
          v-for="(option, index) in options"
          :key="option.value"
          @click="onMenuItemSelect(option)"
          @keyup.enter.stop="onMenuItemSelect(option)"
          :id="option.label"
          :tabindex="++index"
        >
          <span class="sgt-text-md sgt-dropdown-menu-item-text">{{
            option.label
          }}</span>
        </div>
      </div>
    </div>
  </ClickOutsideHOC>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { SgtDropdownOption } from "./SgtDropdown.model";
import ClickOutsideHOC from "../ClickOutsideHOC.vue";

@Component({
  name: "sgt-dropdown",
  components: {
    ClickOutsideHOC,
  },
})
export default class SgtDropdown extends Vue {
  @Prop()
  public selectedOption: SgtDropdownOption;

  @Prop({ required: false, default: "-- Select --" })
  public title: string;

  @Prop({ required: true })
  public options: SgtDropdownOption[];

  @Prop({ required: false, default: "200px" })
  public width: string;

  @Prop({ required: false, default: false })
  public menuOnTop: boolean;

  public isMenuOpen: boolean = false;

  public onMenuItemSelect(selectedOption: SgtDropdownOption) {
    this.$emit("update:selectedOption", selectedOption);
    this.isMenuOpen = false;
  }
}
</script>
<style lang="scss" scoped>
.sgt-dropdown-container {
  display: inline-block;
  position: relative;
  height: 40px;
}
.sgt-dropdown-title {
  display: inline-flex;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid #b7b7b7;
  border-radius: 4px;
  padding: 0.5em 0.625em 0.375em 1em;
  cursor: pointer;
  width: 100%;

  .dropdown-icon {
    transition: transform 150ms ease-in-out;
    &.active {
      transform: rotate(180deg);
    }
  }
}
.sgt-dropdown-title:hover {
  background: #fafafa;
  border-color: #9e9e9e;
}
.sgt-dropdown-title-active {
  background: #ffffff;
  border-color: #6ebe49;
}
.sgt-dropdown-title-text {
  margin-top: 0.188em;
  font: inherit;
}
.sgt-dropdown-menu {
  position: absolute;
  background: #ffffff;
  width: 100%;
  max-height: 188px;
  box-shadow: 8px 6px 8px rgba(0, 0, 0, 0.12);
  z-index: 4;
  border: 1px solid #6ebe49;
  box-sizing: border-box;
  border-radius: 4px;
  overflow: auto;
  top: calc(100% + 10px);
  padding: 0.25em 0;
}
.menu-on-top .dropdown-icon {
  transform: rotate(180deg);
}
.menu-on-top .sgt-dropdown-menu {
  margin-top: 0;
  top: 0;
  transform: translateY(-100%);
}
.sgt-dropdown-menu-item {
  width: 100%;
  min-height: 36px;
  padding-top: 4px;
  padding-left: 0.625em;
  padding-right: 0.625em;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.02);
  }
  &.selected {
    background: rgba(0, 0, 0, 0.02);
  }
  &-text {
    font: inherit;
  }
}
</style>
