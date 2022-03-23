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
        <v-container>
          <v-form v-model="isFormValid">
            <v-row>
              <v-col cols="12" sm="6">
                <div class="sgt-form-group-custom">
                  <label
                    class="sgt-form-group-label"
                    for="username"
                    id="lblusername"
                  >
                    Username*
                    <SgtTooltipIcon>
                      <span>
                        The username must be of minimum 4 characters and maximum
                        56 characters. The username must be alphanumeric and can
                        contain underscore (_) and dash (-).
                      </span>
                    </SgtTooltipIcon>
                  </label>
                  <v-text-field
                    type="text"
                    outlined
                    color="csmprimary"
                    v-model.trim="userDetails.username"
                    dense
                    :rules="validationRules.username"
                    :disabled="this.userData"
                  ></v-text-field>
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="sgt-form-group-custom">
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

            <v-row v-if="this.userData">
              <v-col cols="12" sm="6">
                <div class="sgt-form-group-custom">
                  <label
                    class="sgt-form-group-label"
                    for="password"
                    id="localuser-passwordlbl"
                  >
                    Current Password*
                  </label>
                  <v-text-field
                    type="password"
                    outlined
                    color="csmprimary"
                    v-model.trim="userDetails.currentPassword"
                    dense
                    :rules="validationRules.password"
                  ></v-text-field>
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="6">
                <div class="sgt-form-group-custom">
                  <label
                    class="sgt-form-group-label"
                    for="password"
                    id="localuser-confirmpasslbl"
                    >{{ formLabelItems.passwordLabel }}*
                    <SgtTooltipIcon>
                      <span
                        >Password must contain: Minimum 8 characters, One
                        uppercase letter, One lowercase letter, One special
                        character, One number</span
                      >
                    </SgtTooltipIcon></label
                  >
                  <v-text-field
                    type="password"
                    outlined
                    color="csmprimary"
                    v-model.trim="userDetails.password"
                    dense
                    :rules="validationRules.password"
                  ></v-text-field>
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="sgt-form-group-custom">
                  <label
                    class="sgt-form-group-label"
                    for="password"
                    id="localuser-confirmpasslbl"
                    >Confirm Password*</label
                  >
                  <v-text-field
                    type="password"
                    outlined
                    color="csmprimary"
                    v-model.trim="userDetails.confirmPassword"
                    dense
                    :rules="validationRules.confirmPassword"
                  ></v-text-field>
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <label class="mr-3">Roles</label>
                <v-radio-group v-model="userDetails.role" row mandatory>
                  <v-radio
                    color="csmprimary"
                    label="Admin"
                    value="admin"
                  ></v-radio>
                  <v-radio
                    color="csmprimary"
                    label="Manage"
                    value="manage"
                  ></v-radio>
                  <v-radio
                    color="csmprimary"
                    label="Monitor"
                    value="monitor"
                  ></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-container>
          <v-row>
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
        </v-container>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import SgtTooltipIcon from "../../shared/SgtTooltipIcon.vue";
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
    username: string;
    role: "admin" | "manage" | "monitor";
    email: string;
  };

  public isFormValid = false;
  public userDetails = {
    username: "",
    role: "",
    email: "",
    currentPassword: "",
    password: "",
    confirmPassword: "",
  };

  public validationRules = {
    username: [
      (val: string) => (val || "").length > 0 || "Username is required",
      (val: string) => usernameRegex.test(val) || "Invalid username",
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
      this.userDetails.username = this.userData.username;
      this.userDetails.email = this.userData.email;
      this.userDetails.role = this.userData.role;
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
