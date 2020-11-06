/* * CORTX-CSM: CORTX Management web and CLI interface. * Copyright (c) 2020
Seagate Technology LLC and/or its Affiliates * This program is free software:
you can redistribute it and/or modify * it under the terms of the GNU Affero
General Public License as published * by the Free Software Foundation, either
version 3 of the License, or * (at your option) any later version. * This
program is distributed in the hope that it will be useful, * but WITHOUT ANY
WARRANTY; without even the implied warranty of * MERCHANTABILITY or FITNESS FOR
A PARTICULAR PURPOSE. See the * GNU Affero General Public License for more
details. * You should have received a copy of the GNU Affero General Public
License * along with this program. If not, see <https://www.gnu.org/licenses/>.
* For any questions about this software or licensing, * please email
opensource@seagate.com or cortx-questions@seagate.com. */
<template>
  <div>
    <div class="udx-page-title">
      <label class="cortx-text-lg cortx-text-bold" id="udx-title">{{
        $t("udx-registration.udx-registration")
      }}</label>
    </div>
    <v-stepper v-model="stepNumber">
      <v-stepper-header>
        <v-stepper-step :complete="stepNumber > 1" step="1">
          Login/Create Account
          <small>Login using existing account or create a new Account</small>
        </v-stepper-step>
        <v-divider></v-divider>

        <v-stepper-step :complete="stepNumber > 2" step="2">
          Select/Create Bucket
        </v-stepper-step>
        <v-divider></v-divider>

        <v-stepper-step :complete="stepNumber > 3" step="3">
          Create IAM Account
        </v-stepper-step>
        <v-divider></v-divider>

        <v-stepper-step :complete="stepNumber > 4" step="4">
          Registration Token
        </v-stepper-step>
        <v-divider></v-divider>

        <v-stepper-step step="5">
          Register
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <div style="min-height: 300px;" v-if="stepNumber === 1">
            <cortx-S3-account
              v-if="isCreateAccount"
              ref="s3Account"
              @goToNext= "goToNextPage()">
            </cortx-S3-account>
            <LoginExistingS3Account v-else
              @createAccount="isCreateAccount = true"
              @setS3URL="setS3URL"
              @setAuthToken="setAuthToken"
            />
          </div>
        </v-stepper-content>

        <v-stepper-content step="2">
          <cortx-select-create-bucket
            v-if="stepNumber === 2"
            :authToken="authToken"
            @onChange="updateStep()" >
          </cortx-select-create-bucket>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

          <button class="cortx-btn-primary" @click="stepNumber = 4">
            Continue
          </button>

          <v-btn text>
            Cancel
          </v-btn>
        </v-stepper-content>
        <v-stepper-content step="4">
          <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

          <button class="cortx-btn-primary" @click="stepNumber = 5">
            Continue
          </button>

          <v-btn text>
            Cancel
          </v-btn>
        </v-stepper-content>
        <v-stepper-content step="5">
          <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

          <button class="cortx-btn-primary" @click="stepNumber = 1; createBucket=false">
            Continue
          </button>

          <v-btn text>
            Cancel
          </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import { required, helpers, sameAs, email } from "vuelidate/lib/validators";
import CortxDownloadCsvDialog from "./../s3/download-csv-dialog.vue";
import CortxSelectCreateBucket from "./cortx-select-create-bucket.vue";
import CortxS3Account from  "./cortx-udx-s3-creation.vue";
import i18n from "./../../i18n";
import {
  udxURLRegex,
  accountNameRegex,
  udxBucketNameRegex,
  passwordRegex,
  accountNameTooltipMessage,
  passwordTooltipMessage,
  udxBucketNameTooltipMessage
} from "../../common/regex-helpers";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import LoginExistingS3Account from "./login-existing-s3account.vue";

@Component({
  name: "cortx-udx-registration",
  components: {
    CortxDownloadCsvDialog,
    CortxSelectCreateBucket,
    CortxS3Account,
    LoginExistingS3Account
  }
})
export default class CortxUDXRegistration extends Vue {
  public stepNumber: number = 1;
  public s3URL: any[] = [];
  public authToken: string = "";
  public isCreateAccount: boolean = false;

  public setS3URL(s3URL: any[]) {
    this.s3URL = s3URL;
  }

  public setAuthToken(authToken: string) {
    this.authToken = authToken;
    this.stepNumber = 2;
  }
}
</script>
<style lang="scss" scoped>
.udx-page-title {
  height: 46px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.udx-reg-token-lbl {
  height: 30px;
}
#udx-reg-token {
  height: 30px;
  font-size: 1.5rem;
  font-weight: bold;
}
.cortx-reg-response-container {
  height: 12.5em;
  border-bottom: 1px solid #b7b7b7;
  overflow: auto;
  padding: 16px;
}
.udx-reg-resp-table-label {
  width: 13rem;
}
.cortx-modal-footer {
  height: 3.5em;
  padding: 0.5em;
}
</style>
