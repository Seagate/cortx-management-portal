/*****************************************************************************
 Filename:          udx-registration.vue
 Description:       UDX Registration Component

 Creation Date:     28/10/2019
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div>
    <div class="udx-page-title">
      <label class="eos-text-lg eos-text-bold">UDX Registration</label>
    </div>
    <div id="udx-reg-token-container" class="mt-4" v-if="registrationToken">
      <div class="udx-reg-token-lbl">
        <label class="eos-text-lg eos-float-l">Your registration token</label>
        <label class="eos-float-l mt-1 ml-1">
          <eos-info-tooltip
            message="On your UDX web portal choose 'Add Device' and then enter the identification token below."
          />
        </label>
      </div>
      <div id="udx-reg-token" class="mt-1">
        <label id="udx-reg-token-part-1" class="float-left">
          {{
          registrationToken.substring(0, 4)
          }}
        </label>
        <label id="udx-reg-token-part-2" class="float-left ml-2">
          {{
          registrationToken.substring(4, 8)
          }}
        </label>
        <label id="udx-reg-token-part-3" class="float-left ml-2">
          {{
          registrationToken.substring(8, 12)
          }}
        </label>
      </div>
    </div>
    <div class="mt-3">
      <v-row>
        <v-col class="py-0 pr-0">
          <div
            class="eos-form-group"
            :class="{
              'eos-form-group--error':
                $v.registrationForm.url.$error
            }"
          >
            <label class="eos-form-group-label" for="url">
              <eos-info-tooltip label="URL*" message="Enter the URL provided by your UDX portal." />
            </label>
            <input
              class="eos-form__input_text"
              type="text"
              id="url"
              name="url"
              v-model.trim="registrationForm.url"
              @input="$v.registrationForm.url.$touch"
            />
            <div class="eos-form-group-label eos-form-group-error-msg">
              <label
                v-if="
                  $v.registrationForm.url.$dirty &&
                    !$v.registrationForm.url.required
                "
              >URL is required</label>
            </div>
          </div>
        </v-col>
        <v-col class="py-0 pl-0">
          <div
            class="eos-form-group"
            :class="{
              'eos-form-group--error':
                $v.registrationForm.accountName.$error
            }"
          >
            <label class="eos-form-group-label" for="accountName">
              <eos-info-tooltip
                label="Account Name*"
                message="Minimum 8 characters. Only alphanumeric, underscore and hyphen are allowed."
              />
            </label>
            <input
              class="eos-form__input_text"
              type="text"
              id="accountName"
              name="accountName"
              v-model.trim="registrationForm.accountName"
              @input="$v.registrationForm.accountName.$touch"
            />
            <div class="eos-form-group-label eos-form-group-error-msg">
              <label
                v-if="
                  $v.registrationForm.accountName.$dirty &&
                    !$v.registrationForm.accountName.required
                "
              >Account name is required</label>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="py-0 pr-0">
          <div
            class="eos-form-group"
            :class="{
              'eos-form-group--error':
                $v.registrationForm.bucketName.$error
            }"
          >
            <label class="eos-form-group-label" for="bucketName">
              <eos-info-tooltip
                label="Bucket name*"
                message="Minimum 3 characters. Only alphanumeric, underscore and hyphen are allowed."
              />
            </label>
            <input
              class="eos-form__input_text"
              type="text"
              id="bucketName"
              name="bucketName"
              v-model.trim="registrationForm.bucketName"
              @input="$v.registrationForm.bucketName.$touch"
            />
            <div class="eos-form-group-label eos-form-group-error-msg">
              <label
                v-if="
                  $v.registrationForm.bucketName.$dirty &&
                    !$v.registrationForm.bucketName.required
                "
              >Bucket name is required</label>
            </div>
          </div>
        </v-col>
        <v-col class="py-0 pl-0">
          <div
            class="eos-form-group"
            :class="{
              'eos-form-group--error':
                $v.registrationForm.iamUsername.$error
            }"
          >
            <label class="eos-form-group-label" for="iamUsername">
              <eos-info-tooltip
                label="IAM Username*"
                message="Only alphanumeric, underscore and hyphen are allowed."
              />
            </label>
            <input
              class="eos-form__input_text"
              type="text"
              id="iamUsername"
              name="iamUsername"
              v-model.trim="registrationForm.iamUsername"
              @input="$v.registrationForm.iamUsername.$touch"
            />
            <span
              class="eos-form-group-label eos-form-group-error-msg"
              v-if="
                $v.registrationForm.iamUsername.$dirty &&
                  !$v.registrationForm.iamUsername.required
              "
            >IAM Username is required</span>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="py-0">
          <label class="eos-text-md">I agree to the following:</label>
          <br />
          <label class="eos-ckb-container" for="consentOne">
            Dedicated UDX Bucket may be created in the account.
            <input
              type="checkbox"
              name="consentOne"
              v-model="registrationForm.consentOne"
              id="consentOne"
            />
            <span class="eos-ckb-tick"></span>
          </label>
          <br />
          <label class="eos-ckb-container" for="consentTwo">
            UDX S3 IAM User may be created with full access to UDX bucket (and not to other data).
            <input
              type="checkbox"
              name="consentTwo"
              v-model="registrationForm.consentTwo"
              id="consentTwo"
            />
            <span class="eos-ckb-tick"></span>
          </label>
        </v-col>
      </v-row>
      <v-row class="mt-2">
        <v-col>
          <button
            type="button"
            class="eos-btn-primary"
            @click="registerUDX()"
            :disabled="$v.registrationForm.$invalid || !registrationForm.consentOne || !registrationForm.consentTwo"
          >Register</button>
          <button
            type="button"
            class="ml-8 eos-btn-secondary"
            @click="closeCreateAccountForm()"
          >Cancel</button>
        </v-col>
      </v-row>
    </div>
    <div class="eos-modal-container" v-if="registrationResponse">
      <div class="eos-modal" style="width: 600px;">
        <div class="eos-modal-header">
          <label>Details</label>
          <img
            class="eos-modal-close"
            :src="require('@/assets/close-green.svg')"
            @click="closeRegResponseDetailsDialog()"
          />
        </div>
        <div class="eos-reg-response-container">
          <table class="eos-text-md">
            <tr>
              <td class="py-1 eos-text-bold udx-reg-resp-table-label">Account Name</td>
              <td class="py-1">{{ registrationResponse.account_name }}</td>
            </tr>
            <tr>
              <td class="py-1 eos-text-bold udx-reg-resp-table-label">Access Key</td>
              <td class="py-1">{{ registrationResponse.access_key }}</td>
            </tr>
            <tr>
              <td class="py-1 eos-text-bold udx-reg-resp-table-label">Secret Key</td>
              <td class="py-1">{{ registrationResponse.secret_key }}</td>
            </tr>
            <tr>
              <td class="py-1 eos-text-bold udx-reg-resp-table-label">Bucket Name</td>
              <td class="py-1">{{ registrationResponse.bucket_name }}</td>
            </tr>
          </table>
        </div>
        <div class="eos-modal-footer">
          <button
            type="button"
            class="eos-btn-primary eos-float-r"
            @click="closeRegResponseDetailsDialog()"
          >Ok</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import { required } from "vuelidate/lib/validators";
import { accountNameRegex } from "../../common/regex-helpers";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";

@Component({
  name: "eos-udx-registration"
})
export default class EosUDXRegistration extends Vue {
  public registrationToken: string = "";
  public registrationResponse: any = null;

  public registrationForm = {
    url: "",
    accountName: "",
    bucketName: "",
    iamUsername: "",
    consentOne: false,
    consentTwo: false,
  };

  @Validations()
  public validations = {
    registrationForm: {
      url: { required },
      accountName: { required, accountNameRegex },
      bucketName: { required, accountNameRegex },
      iamUsername: { required, accountNameRegex }
    }
  };

  public async mounted() {
    await this.getRegistrationToken();
  }

  public async registerUDX() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Registering UDX..."
    );
    const res = await Api.post(apiRegister.udx_device, {
        url: this.registrationForm.url,
        account_name: this.registrationForm.accountName,
        iam_username: this.registrationForm.iamUsername,
        bucket_name: this.registrationForm.bucketName
    });
    if (res && res.data) {
      this.registrationResponse = res.data;
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public closeRegResponseDetailsDialog() {
    this.registrationResponse = null;
    this.$emit("complete");
  }

  private async getRegistrationToken() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Fetching registration token..."
    );
    const res = await Api.getAll(apiRegister.udx_reg_token);
    if (res && res.data) {
      this.registrationToken = res.data.registrationToken;
    }
    this.$store.dispatch("systemConfig/hideLoader");
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
.eos-reg-response-container {
  height: 12.5em;
  border-bottom: 1px solid #b7b7b7;
  overflow: auto;
  padding: 16px;
}
.udx-reg-resp-table-label {
  width: 13rem;
}
.eos-modal-footer {
  height: 3.5em;
  padding: 0.5em;
}
</style>
