<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblDataNetwork">Data network settings</div>
      <div class="mt-3" id="lblMsg">
        Use the following options to finalize your Data network settings for
        mapping the system. You can set system to be managed in an IPv4
        network.Additionally the system can be configured to utilize DNS within
        your network. You can skip this section entirely if your network
        settings are complete.
      </div>
      <div class="mt-3" id="lblChoseMsg">Chose which network settings you'd like to establish.</div>
      <v-divider class="mt-2" />
      <div class="mt-6">
        <label class="eos-ckb-container">
          IPv4
          <input
            type="checkbox"
            :disabled="isSkip"
            v-model="isDataipV4Status"
            name="ipv4"
            id="chkDNSisipV4Status"
          />
          <span class="eos-ckb-tick" id="lblDNsIpv4"></span>
        </label>
      </div>
      <div class="mt-2" id="lblDNSSetting">
        Selecting IPv4 will allow you to view settings assigned by DHCP or to
        assign static IPv4 data network for environments that do not support
        DHCP.
      </div>
      <div class="mt-6">
        <label class="eos-ckb-container">
          Skip data network settings
          <input
            type="checkbox"
            @change="isSkipNetworkSettings()"
            :disabled="isDataipV6Status || isDataipV4Status"
            v-model="isSkip"
            name="skip"
            id="chkDNSSkip"
          />
          <span class="eos-ckb-tick" id="lblSkipManagmentSetting"></span>
        </label>
      </div>
      <div class="mt-2" id="lblMsgSkipStep">
        You can skip this step if your management network settings are already
        complete.
      </div>
      <v-divider class="mt-8" />
    </div>
    <span class="d-none">{{ isValidForm }}</span>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { EVENT_BUS } from "./../../../../main";

@Component({
  name: "eos-data-network"
})
export default class EosDataNetwork extends Vue {
  public data() {
    return {
      loadbalancer: "internal",
      isSkip: false
    };
  }
  public mounted() {
    // WizardHook: Open a listener for onNext event
    // So when wizard footer clicks on the Next Button this component can perform its own workflow
    EVENT_BUS.$on("emitOnNext", (res: any) => {
      // Replace with
      /*this.onNext().then({
			res(true);
		  })*/
      res(true);
    });
  }
  public destroyed() {
    // WizardHook: shut off on exit event listner
    EVENT_BUS.$off("emitOnNext");
  }
  get isValidForm() {
    const validate = true;
    // WizardHook: Emit event to sibling wizard footer component
    // to send information about data validation to enable/disable wizard footer
    EVENT_BUS.$emit(
      "validForm",
      this.isDataipV6Status || this.isDataipV4Status || this.$data.isSkip
    );
    return validate;
  }
  public get isDataipV4Status(): any {
    return this.$store.getters["systemConfig/isDataipV4Status"];
  }
  public set isDataipV4Status(status: any) {
    this.$store.commit("systemConfig/setDataNetworkSettings", {
      type: "ipV4",
      flag: status
    });
  }

  public get isDataipV6Status(): any {
    return this.$store.getters["systemConfig/isDataipV6Status"];
  }
  public set isDataipV6Status(status: any) {
    this.$store.commit("systemConfig/setDataNetworkSettings", {
      type: "ipV6",
      flag: status
    });
  }
  public isSkipNetworkSettings() {
    this.$store.commit("systemConfig/setDataNetworkSettings", {
      type: "ipV6",
      flag: false
    });

    this.$store.commit("systemConfig/setDataNetworkSettings", {
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
