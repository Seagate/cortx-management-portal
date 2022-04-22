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
  <v-dialog
    :value="value"
    @input="$emit('input', value)"
    persistent
    max-width="590"
    class="add-edit-user-dialog"
  >
    <v-card>
      <v-card-title class="title-section">
        <span>{{ formLabelItems.formTitle }}</span>
        <span class="close-btn" @click="$emit('close-popup')">&times;</span>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-form v-model="isFormValid">
          <v-row v-if="!this.userData">
            <v-col cols="12" sm="6">
              <div>
                <label
                  class="sgt-form-group-label"
                  for="accountName"
                  id="lbl-account-name"
                >
                  Account Name*
                  <SgtTooltipIcon>
                    <span>
                      The account name must be of minimum 4 characters and
                      maximum 56 characters. The account name must be
                      alphanumeric and can contain underscore (_) and dash (-).
                    </span>
                  </SgtTooltipIcon>
                </label>
                <v-text-field
                  type="text"
                  outlined
                  color="csmprimary"
                  v-model.trim="userDetails.accountName"
                  dense
                  :rules="validationRules.accountName"
                  :disabled="this.userData"
                ></v-text-field>
              </div>
            </v-col>

            <v-col cols="12" sm="6">
              <div>
                <label
                  class="sgt-form-group-label"
                  for="Email"
                  id="localuseremaillbl"
                  >Email*</label
                >
                <v-text-field
                  type="text"
                  outlined
                  color="csmprimary"
                  v-model.trim="userDetails.email"
                  dense
                  :rules="validationRules.email"
                ></v-text-field>
              </div>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="6">
              <div>
                <label
                  class="sgt-form-group-label"
                  for="password"
                  id="localuser-confirmpasslbl"
                >
                  {{ formLabelItems.passwordLabel }}*
                  <SgtTooltipIcon>
                    <span>
                      Password must contain: Minimum 8 characters, One uppercase
                      letter, One lowercase letter, One special character, One
                      number
                    </span>
                  </SgtTooltipIcon>
                </label>
                <v-text-field
                  outlined
                  color="csmprimary"
                  v-model.trim="userDetails.password"
                  dense
                  :rules="validationRules.password"
                  :type="showPassword ? 'text' : 'password'"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                ></v-text-field>
              </div>
            </v-col>

            <v-col cols="12" sm="6">
              <div>
                <label
                  class="sgt-form-group-label"
                  for="password"
                  id="localuser-confirmpasslbl"
                  >Confirm Password*</label
                >
                <v-text-field
                  outlined
                  color="csmprimary"
                  v-model.trim="userDetails.confirmPassword"
                  dense
                  :rules="validationRules.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showConfirmPassword = !showConfirmPassword"
                ></v-text-field>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-row no-gutters>
          <v-col cols="12" class="btn-container">
            <v-btn
              class="white--text"
              color="csmprimary"
              @click="proceedOperation()"
              :disabled="!isFormValid"
              >{{ formLabelItems.ctaBtnLabel }}</v-btn
            >
            <v-btn
              class="white--text"
              color="csmborder"
              @click="cancelOperation()"
              >Cancel</v-btn
            >
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import SgtTooltipIcon from "../../../lib/components/SgtTooltipIcon/SgtTooltipIcon.vue";
import {
  usernameRegex,
  emailRegex,
  passwordRegex,
} from "../../../utils/RegexHelpers";

@Component({
  name: "LrAddOrEditUser",
  components: {
    SgtTooltipIcon,
  },
})
export default class LrAddOrEditUser extends Vue {
  @Prop({ required: true }) value: boolean;
  @Prop({ required: false }) userData: {
    accountName: string;
    email: string;
  };

  public isFormValid = false;
  public showPassword = false;
  public showConfirmPassword = false;
  public userDetails = {
    accountName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  public validationRules = {
    accountName: [
      (val: string) => (val || "").length > 0 || "Account name is required",
      (val: string) => usernameRegex.test(val) || "Invalid account name",
    ],
    email: [
      (val: string) => (val || "").length > 0 || "Email is required",
      (val: string) => emailRegex.test(val) || "Invalid email",
    ],
    password: [
      (val: string) => (val || "").length > 0 || "Password is required",
      (val: string) => passwordRegex.test(val) || "Invalid password",
    ],
    confirmPassword: [
      (val: string) => (val || "").length > 0 || "Password is required",
      (val: string) =>
        val === this.userDetails.password || "Passwords don't match",
    ],
  };

  public formLabels = {
    formTitle: "Add New User",
    passwordLabel: "Password",
    ctaBtnLabel: "Create",
  };

  get formLabelItems() {
    if (this.userData) {
      return {
        formTitle: "Edit user account",
        passwordLabel: "New Password",
        ctaBtnLabel: "Update",
      };
    }
    return this.formLabels;
  }

  public mounted() {
    if (this.userData) {
      this.userDetails.accountName = this.userData.accountName;
      this.userDetails.email = this.userData.email;
    }
  }

  private strEqualityCaseInsensitive(first: string, second: string) {
    return (
      first.localeCompare(second, undefined, { sensitivity: "base" }) === 0
    );
  }

  private proceedOperation() {
    // Data is available in this.userDetails.
    if (this.userData) {
      // API call to edit the existing record
    } else {
      // API call to add a new record
    }
    this.$emit("close-popup");
  }

  private cancelOperation() {
    this.$emit("close-popup");
  }
}
</script>
<style lang="scss" scoped>
.v-dialog {
  .row {
    margin-top: 0;
  }
}
.title-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .close-btn {
    color: $primary;
    font-size: 1.5rem;
    cursor: pointer;
  }
}
.btn-container {
  display: flex;
  gap: 1rem;
  margin: 0.5em 0;
}
</style>
