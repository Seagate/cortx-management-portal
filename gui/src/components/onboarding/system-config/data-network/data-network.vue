<template>
  <v-container class="mt-6">
    <v-img
      id="alert-img"
      :src="require('./../../../../assets/onboarding-wizard.png')"
      width="780px"
      height="70px"
    ></v-img>
    <v-divider />
    <div class="body-2">
      <div class="title mt-6">Data Network Settings</div>
      <div
        class="mt-2"
      >UPDATE THIS TEXT: Use the following screens to finalize your network settings for managing the system. You can set the system to be managed in an IPv4 and IPv6 network or both. Additionally the system can be configured to utilize DNS within your network. You can skip this section entirely if your network settings are complete.</div>
      <div
        class="mt-6"
      >Do you intend to use your own load balancer or the load balancer included in the system?</div>
      <v-divider class="mt-2" />
      <div class="mt-8">
        <input type="radio" name="loadbalancer" v-model="loadbalancer" value="internal" />
        <span class="ml-3 font-weight-medium">Use the included load balancer</span>
      </div>
      <div class="mt-4">
        <input type="radio" name="loadbalancer" v-model="loadbalancer" value="external" />
        <span class="ml-4 font-weight-medium">Use an external load balancer</span>
      </div>
      <div class="mt-8">Chose which network settings you'd like to establish.</div>
      <v-divider class="mt-2" />
      <div class="mt-8">
        <input
          type="checkbox"
          :disabled="isSkip"
          @change="isipV4Status"
          v-model="isipV4Status"
          name="ipv4"
        />
        <span class="ml-3 font-weight-medium">IPv4</span>
      </div>
      <div
        class="mt-2"
      >Selecting IPv4 will allow you to view settings assigned by DHCP or to assign static IPv4 data network for enironments that do not support DHCP.</div>
      <div class="mt-6">
        <input
          type="checkbox"
          :disabled="isSkip"
          @change="isipV6Status"
          v-model="isipV6Status"
          name="ipv6"
        />
        <span class="ml-4 font-weight-medium">IPv6</span>
      </div>
      <div
        class="mt-1"
      >Selecting IPv6 will allow you to view settings assigned by DHCP or to assign static IPv6 data network settings for environments that do not support DHCP.</div>
      <div class="mt-6">
        <input
          type="checkbox"
          @change="isSkipNetworkSettings()"
          :disabled="isipV6Status && isipV4Status"
          v-model="isSkip"
          name="skip"
        />
        <span class="ml-3 font-weight-medium">Skip management network settings</span>
      </div>
      <div
        class="mt-2"
      >You can skip this step if your management network settings are already complete.</div>
      <v-divider class="mt-8" />
      <div class="mt-8">
        <v-btn elevation="0" :disabled="!(isSkip || (isipV6Status || isipV4Status))" color="green">
          <span class="white--text" @click="gotToNextPage()">Continue</span>
        </v-btn>
        <span class="green--text ml-8 pointer" @click="gotToPrevPage()">Back to previous step</span>
      </div>
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

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
    this.$store.commit("alerts/setOnboardingFlag", false);
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
  public gotToPrevPage() {
    if (this.$store.getters["systemConfig/isipV6Status"] === true) {
      this.$router.push("systemconfig3");
    } else if (this.$store.getters["systemConfig/isipV4Status"] === true) {
      this.$router.push("systemconfig2");
    } else if (
      this.$store.getters["systemConfig/isipV6Status"] === false &&
      this.$store.getters["systemConfig/isipV4Status"] === false
    ) {
      this.$router.push("systemconfig1");
    }
  }
  public gotToNextPage() {
    this.$router.push("dataconfig2");
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


