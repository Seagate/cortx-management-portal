/*****************************************************************************
 Filename:          eos-dropdown.vue
 Description:       Dropdown widget Component

 Creation Date:     27/02/2020
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div class="eos-dropdown-container" tabindex="1" @blur="isMenuOpen = false" :style="{ width: width }">
    <div :class="['eos-dropdown-title', isMenuOpen ? 'eos-dropdown-title-active' : '']" @click="isMenuOpen = !isMenuOpen">
      <span class="eos-text-md eos-float-l eos-dropdown-title-text">{{ selectedOption && selectedOption.label ? selectedOption.label : title }}</span>
      <img v-if="isMenuOpen" class="eos-float-r ml-2" :src="require('@/assets/caret-up.svg')" />
      <img v-else class="eos-float-r ml-2" :src="require('@/assets/caret-down.svg')" />
    </div>
    <div class="eos-dropdown-menu" v-show="isMenuOpen">
      <div
        :class="['eos-dropdown-menu-item', selectedOption && selectedOption.value === option.value ? 'selected' : '']"
        v-for="option in options"
        :key="option.value"
        @click="onMenuItemSelect(option)"
      >
        <span class="eos-text-md">{{ option.label }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { EosDropdownOption } from "./eos-dropdown";

@Component({
  name: "eos-dropdown"
})
export default class EosDropdown extends Vue {
  @Prop()
  public selectedOption: EosDropdownOption;

  @Prop({ required: false, default: "-- Select --" })
  public title: string;

  @Prop({ required: true })
  public options: EosDropdownOption[];

  @Prop({ required: false, default: "325px" })
  public width: string;

  public isMenuOpen: boolean = false;

  public onMenuItemSelect(selectedOption: EosDropdownOption) {
    this.$emit("update:selectedOption", selectedOption);
    this.isMenuOpen = false;
  }
}
</script>
<style lang="scss" scoped>
.eos-dropdown-container {
  display: inline-block;
  outline: none;
  position: relative;
  height: 40px;
}
.eos-dropdown-title {
  display: inline-block;
  background: #ffffff;
  border: 1px solid #b7b7b7;
  border-radius: 4px;
  padding: 0.5em 0.625em 0.375em 1em;
  cursor: pointer;
  width: 100%;
}
.eos-dropdown-title:hover {
  background: #fafafa;
  border-color: #9E9E9E;
}
.eos-dropdown-title-active {
  background: #ffffff;
  border-color: #6EBE49;
}
.eos-dropdown-title-text {
  margin-top: 0.188em;
}
.eos-dropdown-menu {
  position: absolute;
  background: #ffffff;
  width: 100%;
  max-height: 188px;
  box-shadow: 8px 6px 8px rgba(0, 0, 0, 0.12);
  z-index: 4;
  border: 1px solid #6EBE49;
  box-sizing: border-box;
  border-radius: 4px;
  overflow: auto;
  margin-top: -6px;
}
.eos-dropdown-menu-item {
  width: 100%;
  min-height: 36px;
  padding-top: 4px;
  padding-left: 0.625em;
  padding-right: 0.625em;
  cursor: pointer;
}
.eos-dropdown-menu-item:hover {
  background: rgba(0, 0, 0, 0.02);
}
.eos-dropdown-menu-item.selected {
  background: rgba(0, 0, 0, 0.02);
}
</style>
