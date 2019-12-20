/*****************************************************************************
 Filename:          check-box.vue
 Description:       Checkbox widget Component

 Creation Date:     20/11/2019
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div class="checkbox-main-container">
    <div
      class="checkbox-container"
      v-bind:class="{ 'checked': control.value.isSelected }"
      @click="toggle()"
    >
      <div class="checkbox-tick"></div>
    </div>
    <label class="checkbox-label" v-if="label">{{ label }}</label>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Form, FormControl, ControlValidator } from "./form-module";

@Component({
  name: "eos-check-box"
})
export default class EosCheckBox extends Vue {
  @Prop({ required: true })
  public id: string;

  @Prop({ required: true })
  public name: string;

  @Prop({ required: true })
  public form: Form;

  private control: FormControl;
  private label: string = "";
  private checkboxGroup: FormControl[] = [];
  private isValidate: boolean = false;

  public beforeMount() {
    this.control = this.form.controlsMap[this.name][this.id];
    if (this.control.validators && this.control.validators.length > 0) {
      this.checkboxGroup = Object.values(
        this.form.controlsMap[this.control.name]
      );
      this.isValidate = true;
    } else {
      this.control.isValid = true;
    }
    if (this.control.config && this.control.config.label) {
      this.label = this.control.config.label;
    }
  }

  public toggle() {
    this.control.isDirty = true;
    this.control.value.isSelected = !this.control.value.isSelected;
    if (this.isValidate) {
      this.validateCheckboxGroup();
    }
  }

  private validateCheckboxGroup() {
    if (this.control.value.isSelected) {
      this.checkboxGroup.forEach(checkbox => {
        checkbox.isValid = true;
      });
    } else {
      let isAllUnchecked: boolean = true;
      for (const checkbox of this.checkboxGroup) {
        if (checkbox.value.isSelected) {
          isAllUnchecked = false;
          break;
        }
      }
      if (isAllUnchecked) {
        this.checkboxGroup.forEach(checkbox => {
          checkbox.isValid = false;
        });
      }
    }
    this.form.validate();
  }
}
</script>
<style lang="scss" scoped>
.checkbox-main-container {
  min-height: 15px;
  clear: both;
}
.checkbox-container {
  width: 14px;
  height: 14px;
  background: #ffffff;
  border: 2px solid rgba(0, 0, 0, 0.87);
  border-radius: 1px;
  cursor: pointer;
  float: left;
}
.checked {
  background: #6ebe49;
  border: 2px solid #6ebe49;
}
.checkbox-tick {
  width: 10px;
  height: 7px;
  border: solid #ffffff;
  border-width: 0 0 2px 2px;
  border-radius: 1px;
  -webkit-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  transform: rotate(-45deg);
}
.checkbox-container.checked:hover {
  background: #ffffff;
  border: 2px solid #6ebe49;
}
.checkbox-container:hover > .checkbox-tick {
  border: solid #6ebe49;
  border-width: 0 0 2px 2px;
}
.checkbox-container.checked:hover > .checkbox-tick {
  border: solid #ffffff;
  border-width: 0 0 2px 2px;
}
.checkbox-label {
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 16px;
  color: rgba(0, 0, 0, 0.87);
  float: left;
  margin-left: 10px;
}
</style>
