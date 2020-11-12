/*
* CORTX-CSM: CORTX Management web and CLI interface.
* Copyright (c) 2020 Seagate Technology LLC and/or its Affiliates
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
* please email opensource@seagate.com or cortx-questions@seagate.com.
*/
<template>
  <div v-if="isUserAlreadyCreated">
    {{ $t("udx-registration.userAlreadyExist") }}:
    {{ registrationForm.iamUsername }}
    <br />
    <div class="mb-2">
      <label
        class="cortx-form-group-label cortx-cursor-pointer create-new-user"
        @click="createANewUser()"
      >{{ $t("udx-registration.createIAMUser") }}</label>
    </div> 
    <button
      class="cortx-btn-primary"
      @click="continueToNextStep()"
      type="button"
    >
      {{ $t("common.continue") }}
    </button>
    <button
      class="cortx-btn-secondary ml-5"
      @click="backToPreviousStep()"
      type="button"
    >
      {{ $t("common.back") }}
    </button>
  </div>
  <div v-else>
    <v-row>
      <v-col class="py-0 pr-0">
        <div
          class="cortx-form-group"
          :class="{
            'cortx-form-group--error': $v.registrationForm.iamUsername.$error
          }"
        >
          <label
            class="cortx-form-group-label"
            for="iamUsername"
            id="udx-iamuserlbl"
          >
            <cortx-info-tooltip
              :label="`${$t('login.user-name-placeholder')}*`"
              :message="accountNameTooltipMessage"
            />
          </label>
          <input
            class="cortx-form__input_text"
            type="text"
            id="iamUsername"
            name="iamUsername"
            autocomplete="off"
            v-model.trim="registrationForm.iamUsername"
            @input="$v.registrationForm.iamUsername.$touch"
          />
          <div class="cortx-form-group-label cortx-form-group-error-msg">
            <label
              id="udx-iamusername-required"
              v-if="
                $v.registrationForm.iamUsername.$dirty &&
                  !$v.registrationForm.iamUsername.required
              "
              >{{ $t("udx-registration.username-required") }}</label
            >
            <label
              id="udx-iamusername-invalid"
              v-else-if="
                $v.registrationForm.iamUsername.$dirty &&
                  !$v.registrationForm.iamUsername.accountNameRegex
              "
              >{{ $t("udx-registration.invalid-user") }}</label
            >
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="py-0 pr-0">
        <div
          class="cortx-form-group"
          :class="{
            'cortx-form-group--error':
              $v.registrationForm.iamUserPassword.$error
          }"
        >
          <label
            class="cortx-form-group-label"
            for="iamUserPassword"
            id="udx-iamuserpasswordlbl"
          >
            <cortx-info-tooltip
              :label="`${$t('login.password-placeholder')}*`"
              :message="passwordTooltipMessage"
            />
          </label>
          <input
            class="cortx-form__input_text"
            type="password"
            id="iamUserPassword"
            name="iamUserPassword"
            autocomplete="off"
            v-model.trim="registrationForm.iamUserPassword"
            @input="$v.registrationForm.iamUserPassword.$touch"
          />
          <div class="cortx-form-group-label cortx-form-group-error-msg">
            <label
              id="udx-iampassword-required"
              v-if="
                $v.registrationForm.iamUserPassword.$dirty &&
                  !$v.registrationForm.iamUserPassword.required
              "
              >{{ $t("udx-registration.password-required") }}</label
            >
            <label
              id="udx-iampassword-invalid"
              v-else-if="
                $v.registrationForm.iamUserPassword.$dirty &&
                  !$v.registrationForm.iamUserPassword.passwordRegex
              "
              >{{ $t("udx-registration.invalid-password") }}</label
            >
          </div>
        </div>
      </v-col>
      <v-col class="py-0 pr-0">
        <div
          class="cortx-form-group"
          :class="{
            'cortx-form-group--error':
              $v.registrationForm.iamUserConfirmPassword.$error
          }"
        >
          <label
            class="cortx-form-group-label"
            for="iamUserConfirmPassword"
            id="udx-confirm-passwordlbl"
            >{{ $t("udx-registration.confirm-pass") }}*</label
          >
          <input
            class="cortx-form__input_text"
            type="password"
            id="iamUserConfirmPassword"
            name="iamUserConfirmPassword"
            autocomplete="off"
            v-model.trim="registrationForm.iamUserConfirmPassword"
            @input="$v.registrationForm.iamUserConfirmPassword.$touch"
          />
          <span
            class="cortx-form-group-label cortx-form-group-error-msg"
            v-if="
              $v.registrationForm.iamUserConfirmPassword.$dirty &&
                !$v.registrationForm.iamUserConfirmPassword
                  .sameAsIAMUserPassword
            "
            >{{ $t("udx-registration.password-match") }}</span
          >
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <button class="cortx-btn-primary" type="button" 
        @click="createUser()"
        :disabled="$v.registrationForm.$invalid">
          {{ $t("common.create-btn") }}
        </button>
        <button
          class="cortx-btn-secondary ml-5"
          @click="backToPreviousStep()"
          type="button"
        >
          {{ $t("common.back") }}
        </button>
      </v-col>
    </v-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import { required, helpers, sameAs, email } from "vuelidate/lib/validators";
import { IAMUser } from "../../models/s3";
import i18n from "./../../i18n";
import {
  udxURLRegex,
  accountNameRegex,
  udxBucketNameRegex,
  passwordRegex,
  accountNameTooltipMessage,
  passwordTooltipMessage
} from "../../common/regex-helpers";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";

@Component({
  name: "cortx-iam-user"
})
export default class CortxIamUser extends Vue {
  public passwordTooltipMessage: string = passwordTooltipMessage;
  public accountNameTooltipMessage: string = accountNameTooltipMessage;
  public policyJSON: string;
  public noBucketPolicy: boolean = false;
  public isUserAlreadyCreated: boolean = false;
  public registrationForm = {
    iamUsername: "",
    iamUserPassword: "",
    iamUserConfirmPassword: ""
  };

  @Prop({ required: true, default: "" })
  public authToken: string;

  @Prop({ required: true })
  public bucketName: string;

  @Validations()
  public validations = {
    registrationForm: {
      iamUsername: { required, accountNameRegex },
      iamUserPassword: { required, passwordRegex },
      iamUserConfirmPassword: {
        sameAsIAMUserPassword: sameAs("iamUserPassword")
      }
    }
  };

  private showUserDetailsDialog: boolean;
  private user: IAMUser;
  private credentialsFileContent: string = "";
  private isCredentialsFileDownloaded: boolean = false;
  private s3Url = [];

  constructor() {
    super();
    this.user = {} as IAMUser;
  }

  public async mounted() {
    this.clearForm();
  }

  public createANewUser() {
    this.isUserAlreadyCreated = false;
    this.clearForm();
  }

  public clearForm() {
    this.registrationForm = {
      iamUsername: "",
      iamUserPassword: "",
      iamUserConfirmPassword: ""
    };
    if (this.$v.registrationForm) {
      this.$v.registrationForm.$reset();
    }
  }

  public continueToNextStep() {
    this.isUserAlreadyCreated = true;
    this.$emit(
      "onChange",
      false,
      this.user.secret_key,
      this.user.access_key_id,
      this.user.user_name
    );
  }

  public backToPreviousStep() {
    this.$emit("onChange", true);
  }

  public async createUser() {
    const config = {
      headers: {
        auth_token: this.authToken
      }
    };
    this.$store.dispatch("systemConfig/showLoader", "Creating IAM user...");
    const IAMUSER = {
      user_name: this.registrationForm.iamUsername,
      require_reset: true,
      password: this.registrationForm.iamUserPassword
    } as IAMUser;

    const res = await Api.postAllWithConfig(
      apiRegister.s3_iam_user,
      config,
      IAMUSER
    );

    if (!res.error) {
      this.user = res.data;
      this.isCredentialsFileDownloaded = false;
      this.isUserAlreadyCreated = false;
      this.credentialsFileContent =
        "data:text/plain;charset=utf-8," +
        encodeURIComponent(this.getCredentialsFileContent());
    }
    this.$store.dispatch("systemConfig/hideLoader");
    this.showUserDetailsDialog = true;

    this.getPolicyDetails();
    this.isUserAlreadyCreated = true;
    this.$emit(
      "onChange",
      false,
      this.user.secret_key,
      this.user.access_key_id,
      this.user.user_name
    );
  }

  public getCredentialsFileContent(): string {
    return (
      "User name,User id,S3 URL,ARN,Access key,Secret key\n" +
      this.user.user_name +
      "," +
      this.user.user_id +
      "," +
      `${this.s3Url[0]} ${this.s3Url[1]}` +
      "," +
      this.user.arn +
      "," +
      this.user.access_key_id +
      "," +
      this.user.secret_key
    );
  }
  public async getPolicyDetails() {
    const config = {
      headers: {
        auth_token: this.authToken
      }
    };
    // Get policy details
    try {
      const resp = await Api.getAllWithConfig(
        apiRegister.bucket_policy + "/" + this.bucketName,
        config
      );
      this.policyJSON = JSON.stringify(resp.data, null, 4);
    } catch (error) {
      this.policyJSON = "";
      this.noBucketPolicy = true;
    }
    // Update entry
    const resource: string = "arn:aws:s3:::" + this.bucketName + "/*";
    const date: string = new Date().toDateString();
    if (this.noBucketPolicy) {
      this.policyJSON = JSON.stringify({
        Version: date,
        Statement: [
          {
            Sid: "UdxIamAccountPerm",
            Action: [
              "s3:GetObject",
              "s3:PutObject",
              "s3:ListMultipartUploadParts",
              "s3:AbortMultipartUpload",
              "s3:GetObjectAcl",
              "s3:PutObjectAcl",
              "s3:PutObjectTagging"
            ],
            Effect: "Allow",
            Resource: resource,
            Principal: { AWS: this.user.arn }
          }
        ]
      });
      const policy = JSON.parse(this.policyJSON);
      const response: any = await Api.put(
        apiRegister.bucket_policy,
        policy,
        this.bucketName,
        config
      );
    } else {
      const policy = JSON.parse(this.policyJSON);
      const statement = {
        Sid: "UdxIamAccountPerm",
        Action: [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListMultipartUploadParts",
          "s3:AbortMultipartUpload",
          "s3:GetObjectAcl",
          "s3:PutObjectAcl",
          "s3:PutObjectTagging"
        ],
        Effect: "Allow",
        Resource: resource,
        Principal: { AWS: this.user.arn }
      };
      policy.Statement.push(statement);
      const response: any = await Api.put(
        apiRegister.bucket_policy,
        policy,
        this.bucketName,
        config
      );
    }
  }
}
</script>
<style lang="scss" scoped>
.create-new-user {
 color: #6ebe49; 
 text-decoration: underline;
}
</style>
