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
  <div id="udx-reg-container" class="mt-5 ml-5">
    <Loader :show="showLoader" :message="loaderMessage" />
    <div id="udx-reg-form" v-if="!udxDevice && !isFetchingDeviceDetails">
      <div id="udx-reg-form-title-container" class="udx-reg-page-title">
        <label id="udx-reg-form-title" class="headline font-weight-bold">UDX Registration</label>
      </div>
      <div id="udx-reg-token-container" class="mt-4" v-if="identificationToken">
        <label id="udx-reg-token-lbl">Your Identification Token</label>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-icon class="csmprimary--text mx-2" size="20" v-on="on">mdi-help-circle-outline</v-icon>
          </template>
          <span>On your UDX web portal choose "Add Device" and then enter the identification token below.</span>
        </v-tooltip>
        <div id="udx-reg-token" class="mt-1">
          <label
            id="udx-reg-token-part-1"
            class="float-left"
          >{{ identificationToken.substring(0,4) }}</label>
          <label
            id="udx-reg-token-part-2"
            class="float-left ml-2"
          >{{ identificationToken.substring(4,8) }}</label>
          <label
            id="udx-reg-token-part-3"
            class="float-left ml-2"
          >{{ identificationToken.substring(8,12) }}</label>
        </div>
        <div id="udx-reg-url-textbox-container" class="mt-6">
          <div id="udx-reg-url-textbox-lbl-container">
            <span id="udx-reg-url-textbox-lbl" class="font-weight-medium">Enter URL</span>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-icon class="csmprimary--text mx-2" size="20" v-on="on">mdi-help-circle-outline</v-icon>
              </template>
              <span>Enter the URL provided by your UDX portal.</span>
            </v-tooltip>
          </div>
          <input
            class="input-text my-2"
            type="text"
            id="udx-reg-url-textbox"
            name="url"
            v-model="url"
          />
        </div>
        <div id="udx-reg-url-submit-btn" class="mt-2">
          <v-btn color="success" @click="registerUDX()" :disabled="!url">
            <span class="white--text">Register</span>
          </v-btn>
        </div>
      </div>
    </div>
    <v-dialog v-model="showRegistrationSuccessDialog" persistent width="500">
      <v-card>
        <v-system-bar color="greay lighten-3">
          <v-spacer></v-spacer>
          <v-icon @click="continueAfterRegistration()" class="cursor-pointer">mdi-close</v-icon>
        </v-system-bar>
        <v-card-title class="title ml-3">
          <img class="mr-2" src="./../../assets/status/healthy-icon.png" />
          <span>Success</span>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <label
            class="ml-3 udx-registration-success-msg"
          >This device has been successfully registered.</label>
        </v-card-text>
        <v-card-actions>
          <v-btn color="csmprimary" @click="continueAfterRegistration()" class="ma-5 elevation-0">
            <span class="white--text">Continue</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div id="udx-device-details-container" v-if="udxDevice">
      <div id="udx-device-details-title-container" class="udx-reg-page-title">
        <label
          id="udx-device-details-title"
          class="headline font-weight-bold"
        >UDX Registration Details</label>
      </div>
      <table id="udx-device-details" class="mt-4 udx-device-details">
        <tr>
          <td class="py-2 udx-device-detail-item-label">Name</td>
          <td class="py-2">{{ udxDevice.name }}</td>
        </tr>
        <tr>
          <td class="py-2 udx-device-detail-item-label">Product ID</td>
          <td class="py-2">{{ udxDevice.productID }}</td>
        </tr>
        <tr>
          <td class="py-2 udx-device-detail-item-label">Serial Number</td>
          <td class="py-2">{{ udxDevice.serialNumber }}</td>
        </tr>
        <tr>
          <td class="py-2 udx-device-detail-item-label">Type</td>
          <td class="py-2">{{ udxDevice.type }}</td>
        </tr>
        <tr>
          <td class="py-2 udx-device-detail-item-label">UUID</td>
          <td class="py-2">{{ udxDevice.uuid }}</td>
        </tr>
        <tr>
          <td class="py-2 udx-device-detail-item-label">Vendor ID</td>
          <td class="py-2">{{ udxDevice.vendorID }}</td>
        </tr>
      </table>
      <v-btn color="csmprimary" @click="showConfirmUnregisterDialog = true" class="mt-5 elevation-0">
        <span class="white--text">Deregister</span>
      </v-btn>
      <v-dialog v-model="showConfirmUnregisterDialog" persistent max-width="790">
        <v-card>
          <v-system-bar color="greay lighten-3">
            <v-spacer></v-spacer>
            <v-icon @click="closeConfirmUnregisterDialog('no')" style="cursor: pointer;">mdi-close</v-icon>
          </v-system-bar>
          <v-card-title class="title ml-3">
            <img class="mr-2" src="./../../assets/status/warning.png" />
            <span>Confirmation</span>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <label class="ml-3 unregister-confirmation-msg">Are you sure you want to deregister?</label>
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="csmprimary"
              @click="closeConfirmUnregisterDialog('yes')"
              class="ma-5 elevation-0"
            >
              <span class="white--text">Yes</span>
            </v-btn>
            <v-btn
              color="csmprimary"
              outlined
              @click="closeConfirmUnregisterDialog('no')"
              class="ma-5 elevation-0"
            >
              <span style="text-transform: none;">No</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import { UDXDevice } from "../../models/udx";
import Loader from "../widgets/loader.vue";

@Component({
  name: "eos-udx",
  components: { Loader }
})
export default class UDXRegistration extends Vue {
  private isUDXRegistered: boolean = false;
  private identificationToken: string = "";
  private url: string = "";
  private showLoader: boolean = false;
  private loaderMessage: string = "";
  private showRegistrationSuccessDialog: boolean = false;
  private udxDevice: UDXDevice | null;
  private isFetchingDeviceDetails: boolean = false;
  private showConfirmUnregisterDialog: boolean = false;

  public async mounted() {
    await this.getUDXRegistrationStatus();
    if (this.isUDXRegistered) {
      await this.getUDXRegistrationDetails();
    } else {
      this.getIdentificationToken();
    }
  }

  public async registerUDX() {
    this.showLoader = true;
    this.loaderMessage = "Registering UDX...";
    try {
      await Api.post(apiRegister.udx_device, {
        url: this.url,
        pin: "0000"
      });
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.error(error);
    }
    this.showLoader = false;
    this.loaderMessage = "";
    this.showRegistrationSuccessDialog = true;
  }

  public unregisterUDX() {
    this.udxDevice = null;
    this.getIdentificationToken();
  }

  public continueAfterRegistration() {
    this.identificationToken = "";
    this.url = "";
    this.showRegistrationSuccessDialog = false;
    this.getUDXRegistrationDetails();
  }

  public closeConfirmUnregisterDialog(confirmation: string) {
    this.showConfirmUnregisterDialog = false;
    if (confirmation === "yes") {
      this.unregisterUDX();
    }
  }

  private async getUDXRegistrationStatus() {
    this.showLoader = true;
    this.loaderMessage = "Checking if UDX is registered...";
    try {
      const res = await Api.getAll(apiRegister.udx_reg_status);
      if (res && res.data) {
        this.isUDXRegistered = res.data.isRegistered;
      }
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.error(error);
    }
    this.showLoader = false;
    this.isFetchingDeviceDetails = false;
  }

  private async getUDXRegistrationDetails() {
    this.isFetchingDeviceDetails = true;
    this.showLoader = true;
    this.loaderMessage = "Fetching UDX registration details...";
    try {
      const res = await Api.getAll(apiRegister.udx_device);
      if (res.data && res.data.length > 0) {
        this.udxDevice = res.data[0];
      }
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.error(error);
    }
    this.showLoader = false;
    this.isFetchingDeviceDetails = false;
  }

  private async getIdentificationToken() {
    this.showLoader = true;
    this.loaderMessage = "Generating Identification Token...";
    try {
      const res = await Api.getAll(apiRegister.udx_reg_token);
      this.identificationToken = res.data.registrationToken;
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.error(error);
    }
    this.showLoader = false;
    this.loaderMessage = "";
  }
}
</script>
<style lang="scss" scoped>
.input-text {
  border-style: solid;
  border-width: 1px;
  border-color: #e3e3e3;
  width: 30em;
  height: 2.5em;
}
.udx-device-details {
  font-size: 14px;
}
.udx-device-detail-item-label {
  font-weight: bold;
  width: 13rem;
}
.udx-reg-page-title {
  height: 46px;
  border-bottom: 1px solid lightgrey;
}
#udx-reg-token-lbl {
  font-size: 1rem;
  font-weight: bold;
}
#udx-reg-token {
  height: 30px;
  font-size: 1.5rem;
  font-weight: bold;
}
.udx-registration-success-msg {
  color: #000;
  font-size: 16px;
}
.float-left {
  float: left;
}
.cursor-pointer {
  cursor: pointer;
}
.unregister-confirmation-msg {
  color: #000;
  font-size: 16px;
}
</style>
