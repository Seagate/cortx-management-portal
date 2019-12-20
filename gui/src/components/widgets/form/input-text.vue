/*****************************************************************************
 Filename:          input-text.vue
 Description:       Input type text Component

 Creation Date:     15/12/2019
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div style="width: 20rem;min-height:80px;">
    <div class="font-weight-medium" v-if="control.config.label">
      <div style="float: left;">
        <label
          v-bind:class="{ 'has-error': control.isDirty && !control.isValid }"
        >{{ control.config.label }}</label>
        <span class="input-required">*</span>
      </div>
      <v-tooltip right v-if="control.config && control.config.informationText" max-width="200">
        <template v-slot:activator="{ on }">
          <v-icon style="float: right;color: #00A1DD;" size="20" v-on="on">mdi-information-outline</v-icon>
        </template>
        <span>{{ control.config.informationText }}</span>
      </v-tooltip>
    </div>
    <input
      class="input-text"
      v-bind:class="{ 'has-error': control.isDirty && !control.isValid }"
      :id="control.id"
      :name="control.name"
      :type="control.type"
      v-model="control.value.value"
      v-on:keyup="onPropertyChanged()"
    />
    <div class="error-msg">
      <span v-if="control.isDirty">{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import {
  Form,
  FormControl,
  ControlCompareWith,
  ControlValidator
} from "./form-module";

@Component({
  name: "eos-input-text"
})
export default class EosInputText extends Vue {
  @Prop({ required: true })
  public id: string;

  @Prop({ required: true })
  public name: string;

  @Prop({ required: true })
  public form: Form;

  @Prop({ required: false })
  public controlCompareWith: ControlCompareWith;

  private control: FormControl;
  private compareWithControl: FormControl;
  private errorMessage: string = "";
  private isValidate: boolean = false;

  public beforeMount() {
    this.control = this.form.controlsMap[this.name][this.id];
    this.isValidate =
      this.control.validators && this.control.validators.length > 0;
    if (this.controlCompareWith) {
      this.compareWithControl = this.form.controlsMap[
        this.controlCompareWith.name
      ][this.controlCompareWith.id];
    }
  }

  public onPropertyChanged() {
    this.control.isDirty = true;
    if (this.isValidate) {
      for (const validator of this.control.validators) {
        switch (validator.type) {
          case ControlValidator.TYPE_REQUIRED:
            this.control.isValid = this.control.value.value ? true : false;
            break;
          case ControlValidator.TYPE_REGEX:
            this.control.isValid = validator.regex.test(
              this.control.value.value
            )
              ? true
              : false;
            break;
          case ControlValidator.TYPE_COMPARE_WITH:
            this.control.isValid =
              this.control.value.value === this.compareWithControl.value.value;
            break;
        }
        if (this.control.isValid) {
          this.errorMessage = "";
        } else {
          this.errorMessage = validator.invalidValueMessage;
          break;
        }
      }
      this.form.validate();
    }
  }
}
</script>
<style lang="scss" scoped>
label.has-error {
  color: #dc1f2e;
}
input:focus {
  outline: 0;
}
.input-text {
  background: #ffffff;
  border: 1px solid #9e9e9e;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  border-radius: 4px;
  height: 40px;
  width: 20rem;
  padding-left: 16px;
}
input.has-error {
  border-color: #dc1f2e;
}
.input-required {
  margin-left: 4px !important;
  color: #dc1f2e;
}
.error-msg {
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;
  color: #dc1f2e;
  height: 12px;
}
</style>
