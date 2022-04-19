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
  <v-dialog :value="showUserDialog" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <div class="title-container">
          {{ formType === "create" ? "Add New User" : "Reset Password" }}
          <SgtSvgIcon
            icon="close-green.svg"
            @click="closeForm"
            class="close-btn"
            tooltip="Close"
          />
        </div>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <div class="content-container">
          <v-form ref="form" v-model="formValid">
            <v-container>
              <v-row v-if="formType === 'create'">
                <v-col cols="12" sm="6">
                  <label for="username">Username * </label>
                  <SgtTooltipIcon>
                    <template #default>
                      <div class="i-content">
                        The username must be of minimum 4 characters and maximum
                        56 characters. The username must be alphanumeric and can
                        contain underscore (_) and dash (-).
                      </div>
                    </template>
                  </SgtTooltipIcon>
                  <v-text-field
                    name="username"
                    ref="username"
                    v-model="userForm.username"
                    outlined
                    :rules="usernameRules"
                    validate-on-blur
                    type="text"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6">
                  <label for="password">New Password * </label>
                  <SgtTooltipIcon>
                    <template #default>
                      <div class="i-content">
                        Password must contain: Minimum 8 characters, One
                        uppercase letter, One lowercase letter, One special
                        character, and One number
                      </div>
                    </template>
                  </SgtTooltipIcon>
                  <v-text-field
                    name="password"
                    ref="password"
                    v-model="userForm.password"
                    outlined
                    :rules="passwordRules"
                    validate-on-blur
                    :type="showPassword ? 'text' : 'password'"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <label for="confirmPassword">Confirm Password * </label>
                  <v-text-field
                    name="confirmPassword"
                    ref="confirmPassword"
                    v-model="userForm.confirmPassword"
                    :rules="confirmPasswordRules"
                    outlined
                    validate-on-blur
                    :type="showConfirmPassword ? 'text' : 'password'"
                    :append-icon="
                      showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'
                    "
                    @click:append="showConfirmPassword = !showConfirmPassword"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="csmprimary" @click="validateForm()" dark>{{
          formType === "create" ? "Create" : "Reset"
        }}</v-btn>
        <v-btn color="csmdisabled" @click="closeForm()" depressed dark
          >Cancel</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import SgtSvgIcon from "@/lib/components/SgtSvgIcon/SgtSvgIcon.vue";
import { passwordTest, usernameTest } from "@/utils/CommonUtilFunctions";
import { UserForm } from "./LrS3User.model";
import SgtTooltipIcon from "@/lib/components/SgtTooltipIcon/SgtTooltipIcon.vue";

@Component({
  name: "LrS3UserForm",
  components: { SgtSvgIcon, SgtTooltipIcon },
})
export default class LrS3UserForm extends Vue {
  @PropSync("showDialog", { required: true, default: false })
  private showUserDialog: boolean;
  @Prop({ required: false, default: "edit" }) private formType:
    | "create"
    | "edit";
  formValid = false;
  userForm: UserForm = {
    username: "",
    password: "",
    confirmPassword: "",
  };
  showPassword = false;
  showConfirmPassword = false;

  get usernameRules() {
    return [
      (value: any) => !!value || "Required.",
      (value: any) =>
        (value && value.length >= 4 && value.length <= 54) ||
        "The username must be of minimum 4 characters and maximum 56 characters",
      (value: any) =>
        (value && usernameTest(value)) ||
        "Should be Alphanumeric and can contain underscore (_) and dash (-) only.",
    ];
  }

  get passwordRules() {
    return [
      (value: any) => !!value || "Required.",
      (value: any) =>
        (value && passwordTest(value)) || "Please enter a valid password",
    ];
  }
  get confirmPasswordRules() {
    return [
      (value: any) => !!value || "Required.",
      (value: any) =>
        (value && value == this.userForm.password) ||
        "Confirm password mismatch ",
    ];
  }

  validateForm() {
    (this.$refs.form as Vue & { validate: () => boolean }).validate();
    if (this.formValid) {
      this.formType === "edit" ? delete this.userForm.username : true;
      this.$emit("formData", this.userForm);
    }
  }

  closeForm() {
    (this.$refs.form as Vue & { reset: () => boolean }).reset();
    this.showUserDialog = false;
  }
}
</script>
<style lang="scss" scoped>
.title-container {
  width: 100%;
  .close-btn {
    cursor: pointer;
    float: right;
  }
  .title-content {
    display: inline-block;
  }
  .title-icon {
    vertical-align: top;
    padding-right: 0.5rem;
  }
}
.content-container {
  margin-top: 1rem;
  .content-title {
    color: $warning;
    font-size: 1rem;
    .content-title-icon {
      padding-right: 0.5rem;
    }
  }
}
</style>