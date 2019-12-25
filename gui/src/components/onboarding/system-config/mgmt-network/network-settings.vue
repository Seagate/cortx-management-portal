<template>
  <v-container class="mt-6 ml-6">
    <v-img
      id="alert-img"
      :src="require('./../../../../assets/onboarding-wizard.png')"
      width="780px"
      height="70px"
    ></v-img>
    <v-divider />
    <div class="body-2">
      <div class="title mt-6" id="lblNSManangement">Management Network Settings</div>
      <div class="mt-2" id="lblNSMsg">
        Use the following screens to finalize your management network settings for mapping the system. You can set
        system to be managed in an IPv4 network, an IPv6 network or both. You can skip this section entirely if your
        network settings are complete.
      </div>
      <div class="mt-6">Choose which network settings you'd like to establish.</div>
      <v-divider class="mt-2" />
      <div class="mt-8">
        <input type="checkbox" name="ipv4" :disabled="isSkip" v-model="isipV4Status" id="chkNsisipV4Status" />
        <span class="ml-3 font-weight-medium">IPv4</span>
      </div>
      <div class="mt-2">
        Selecting IPv4 will allow you to view settings assigned by DHCP or to assign static IPv4 data network for
        enironments that do not support DHCP.
      </div>
      <div class="mt-6">
        <input type="checkbox" :disabled="isSkip" v-model="isipV6Status" name="ipv6" id="chkNsisipV6Status" />
        <span class="ml-4 font-weight-medium">IPv6</span>
      </div>
      <div class="mt-1" id="lblNsIp6Msg">
        Selecting IPv6 will allow you to view settings assigned by DHCP or to assign static IPv6 data network settings
        for environments that do not support DHCP.
      </div>
      <div class="mt-6">
        <input
          type="checkbox"
          name="skip"
          v-model="isSkip"
          :disabled="isipV6Status || isipV4Status"
          value="skip"
          id="chkNSStatus"
        />
        <span class="ml-3 font-weight-medium" id="lblNSSkipSetting">Skip management network settings</span>
      </div>
      <div class="mt-2" id="lblNSMsgSkipSetting">
        You can skip this step if your Management Network Settings are already complete.
      </div>
      <v-divider class="mt-8" />
      <div class="mt-8">
        <v-btn @click="gotoNextPage()" elevation="0" color="csmprimary" id="btnNSContinue">
          <span class="white--text">Continue</span>
        </v-btn>
        <span class="csmprimary--text ml-8 pointer" id="lblNSBack">Back to previous step</span>
      </div>
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { SystemConfigObject } from "./../../../../models/system-configuration";

@Component({
  name: "eos-network-settings"
})
export default class EosNetworkSettings extends Vue {
  public data() {
    return {
      isSkip: false
    };
  }
  public mounted() {
    this.$store.dispatch("systemConfig/getSystemConfigAction");
    this.$store.commit("alerts/setOnboardingFlag", false);
  }
  public setMgmtNetworkSettingsType(status: any) {
    this.$store.commit("systemConfig/setNetworkManagementSettings", status);
  }
  public gotoNextPage() {
    this.createManagementNetworkObj();
    if (this.isipV4Status === true) {
      this.$router.push("systemconfig2");
    } else if (this.isipV6Status === true) {
      this.$router.push("systemconfig3");
    } else if (this.isipV4Status === false && this.isipV6Status === false) {
      this.$router.push("dataconfig1");
    }
  }
  public createManagementNetworkObj() {
    return this.$store.dispatch("systemConfig/createManagementNetworkObj");
  }

  public get isipV4Status(): any {
    return this.$store.getters["systemConfig/isipV4Status"];
  }
  public set isipV4Status(status: any) {
    this.$store.commit("systemConfig/setNetworkManagementSettings", {
      type: "ipV4",
      flag: status
    });
  }

  public get isipV6Status(): any {
    return this.$store.getters["systemConfig/isipV6Status"];
  }

  public set isipV6Status(status: any) {
    this.$store.commit("systemConfig/setNetworkManagementSettings", {
      type: "ipV6",
      flag: status
    });
  }
  public isSkipNetworkSettings() {
    this.$store.commit("systemConfig/setNetworkManagementSettings", {
      type: "ipV6",
      flag: false
    });

    this.$store.commit("systemConfig/setNetworkManagementSettings", {
      type: "ipV4",
      flag: false
    });
  }
}
</script>

<style lang="scss" scoped>
.pointer {
  cursor: pointer;
}
</style>
