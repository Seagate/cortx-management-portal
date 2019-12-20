/*****************************************************************************
 Filename:          radio-button.vue
 Description:       Radio button widget Component

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
  <div class="radio-container">
    <div
      class="radio-button-container"
      v-bind:class="{ 'checked': control.value.isSelected }"
      @click="toggle()"
    >
      <div class="radio-button-tick" v-bind:class="{ 'tick-checked': control.value.isSelected }"></div>
    </div>
    <label class="radio-button-label" v-if="label">{{ label }}</label>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Form, FormControl, ControlValidator } from "./form-module";

@Component({
  name: "eos-radio-button"
})
export default class EosRadioButton extends Vue {
  @Prop({ required: true })
  public id: string;

  @Prop({ required: true })
  public name: string;

  @Prop({ required: true })
  public form: Form;

  private control: FormControl;
  private label: string = "";
  private radioGroup: FormControl[] = [];
  private isValidate: boolean = false;

  public beforeMount() {
    this.control = this.form.controlsMap[this.name][this.id];
    this.radioGroup = Object.values(this.form.controlsMap[this.control.name]);
    if (this.control.validators && this.control.validators.length > 0) {
      this.isValidate = true;
    } else {
      this.control.isValid = true;
    }
    if (this.control.config && this.control.config.label) {
      this.label = this.control.config.label;
    }
  }

  public toggle() {
    if (!this.control.value.isSelected) {
      for (const radio of this.radioGroup) {
        if (radio.value.isSelected) {
          radio.value.isSelected = false;
          break;
        }
      }
      this.control.isDirty = true;
      this.control.value.isSelected = true;
      if (this.isValidate) {
        this.validateRadioGroup();
      }
    }
  }

  private validateRadioGroup() {
    if (this.control.value.isSelected) {
      this.radioGroup.forEach(radio => {
        radio.isValid = true;
      });
    }
    this.form.validate();
  }
}
</script>
<style lang="scss" scoped>
.radio-container {
  min-height: 18px;
  clear: both;
}
.radio-button-container {
  width: 16px;
  height: 16px;
  background: #ffffff;
  border: 2px solid rgba(0, 0, 0, 0.87);
  border-radius: 50%;
  cursor: pointer;
  float: left;
}
.checked {
  background: #ffffff;
  border: 2px solid #6ebe49;
}
.radio-button-tick {
  position: relative;
  top: 2px;
  left: 2px;
  width: 8px;
  height: 8px;
  background: #ffffff;
  border-radius: 50%;
}
.tick-checked {
  background: #6ebe49;
}
.radio-button-container.checked:hover {
  background: #ffffff;
  border: 2px solid #6ebe49;
}
.radio-button-container:hover > .radio-button-tick {
  background: #6ebe49;
}
.radio-button-container.checked:hover > .radio-button-tick {
  background: #ffffff;
}
.radio-button-label {
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 18px;
  color: rgba(0, 0, 0, 0.87);
  float: left;
  margin-left: 10px;
}
</style>
