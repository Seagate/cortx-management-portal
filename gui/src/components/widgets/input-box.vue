/*****************************************************************************
 Filename:          loader.vue
 Description:       Loader widget Component

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
  <div style="width: 20rem;">
    <div class="font-weight-medium" v-if="control.label">
      <div style="float: left;">
        <label
          v-bind:class="{ 'has-error': control.isDirty && !control.isValid }"
        >{{ control.label }}</label>
        <span class="input-required">*</span>
      </div>
      <v-tooltip right v-if="control.informationText" max-width="200">
        <template v-slot:activator="{ on }">
          <v-icon style="float: right;color: #00A1DD;" size="20" v-on="on">mdi-information-outline</v-icon>
        </template>
        <span>{{ control.informationText }}</span>
      </v-tooltip>
    </div>
    <input
      class="input-text"
      v-bind:class="{ 'has-error': control.isDirty && !control.isValid }"
      :type="control.type"
      :name="control.name"
      v-model="control.value"
    />
    <div class="error-msg">
      <span v-if="control.isDirty">{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Form, FormControl } from "./form-widget";

@Component({
  name: "eos-input-box"
})
export default class EosInputBox extends Vue {
  @Prop({ required: true })
  public form!: Form;

  @Prop({ required: true })
  public control!: FormControl;

  @Prop({ required: false })
  public compareWithControl!: FormControl;

  private errorMessage: string = "";

  @Watch("control.value")
  public onPropertyChanged(newValue: string, oldValue: string) {
    this.control.isDirty = true;
    if (newValue) {
      if (this.compareWithControl) {
        if (this.control.value === this.compareWithControl.value) {
          this.errorMessage = "";
          this.control.isValid = true;
        } else {
          this.errorMessage = this.compareWithControl.label + " does not match";
          this.control.isValid = false;
        }
      } else {
        if (this.control.validator) {
          if (this.control.validator.validatorRegEx.test(newValue)) {
            this.errorMessage = "";
            this.control.isValid = true;
          } else {
            this.errorMessage = this.control.validator.invalidMessage;
            this.control.isValid = false;
          }
        } else {
          this.errorMessage = "";
          this.control.isValid = true;
        }
      }
    } else {
      this.control.isValid = false;
      this.errorMessage = this.control.requiredMessage;
    }
    this.form.validate();
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
