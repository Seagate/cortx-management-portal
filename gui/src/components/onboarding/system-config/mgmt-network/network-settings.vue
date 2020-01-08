<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblNSManagement">
        Management network settings
      </div>
      <div class="mt-6" id="lblNSMsg">
        Use the following screens to finalize your Management network settings
        for mapping the system. You can set system to be managed in an IPv4
        network. You can skip this section entirely if your network settings are
        complete.
      </div>
      <div class="mt-6">
        Choose which network settings you'd like to establish.
      </div>
      <v-divider class="mt-2" />
      <div class="mt-8">
        <input
          type="checkbox"
          name="ipv4"
          :disabled="isSkip"
          v-model="isipV4Status"
          id="chkNsisipV4Status"
        />
        <label for="chkNsisipV4Status">
          <span class="ml-3 font-weight-bold">IPv4</span>
        </label>
      </div>
      <div class="mt-2">
        Selecting IPv4 will allow you to view settings assigned by DHCP or to
        assign static IPv4 data network for environments that do not support
        DHCP.
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
        <label for="chkNSStatus">
          <span class="ml-3 font-weight-bold" id="lblNSSkipSetting"
            >Skip management network settings</span
          ></label
        >
      </div>
      <div class="mt-2" id="lblNSMsgSkipSetting">
        You can skip this step if your management network settings are already
        complete.
      </div>
    </div>
    <span class="d-none">{{ isValidForm }}</span>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { SystemConfigObject } from "./../../../../models/system-configuration";
import { EVENT_BUS } from "./../../../../main";

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
    // WizardHook: Open a listener for onNext event
    // So when wizard footer clicks on the Next Button this component can perform its own workflow
    EVENT_BUS.$on("emitOnNext", (res: any) => {
      this.createManagementNetworkObj()
        .then(result => {
          res(true);
        })
        .catch(err => {});
    });
  }
  public destroyed() {
    // WizardHook: shut off on exit event listner
    EVENT_BUS.$off("emitOnNext");
  }
  get isValidForm() {
    // WizardHook: Emit event to sibling wizard footer component
    // to send information about data validation to enable/disable wizard footer
    EVENT_BUS.$emit(
      "validForm",
      this.isipV6Status || this.isipV4Status || this.$data.isSkip
    );
    return true;
  }

  public setMgmtNetworkSettingsType(status: any) {
    this.$store.commit("systemConfig/setNetworkManagementSettings", status);
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
