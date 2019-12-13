<template>
  <v-container class="mt-6">
    <v-img
      id="alert-img"
      :src="require('./../../../../assets/onboarding-wizard.png')"
      width="780px"
      height="70px"
    ></v-img>
    <v-divider />
    <v-row>
      <v-col cols="6">
        <div class="body-2">
          <div class="title mt-6" id="lblNetworkIP4">Management Network Settings: IPv4</div>
          <div
            class="mt-6"
            id="lblNetworkMsg"
          >You need to configure a single IP address for management of this system.</div>
          <v-divider class="mt-2" />
          <div class="font-weight-bold mt-6" id="lblIp4Source">
            Source
            <v-icon class="green--text" size="20">mdi-help-circle-outline</v-icon>
          </div>
          <div class="mt-4">
            <input type="radio" name="source" v-model="source" value="manual" />
            <span class="ml-3 font-weight-bold" id="lblIp4Manual">Manual</span>
            <input class="ml-10" type="radio" disabled name="DHCP" value="DHCP" id="txtIP4DHCP" />
            <span class="ml-3 font-weight-bold" id="lblIp4DHCP">DHCP</span>
          </div>
          <div>
            <div class="mt-4">
              <span class="font-weight-bold" id="lblIp4Adress">IP Address</span>
              <div>
                <input
                  class="input-text"
                  type="text"
                  name="ipaddress"
                  v-model="ipv4IpAddress"
                  id="txtIpv4IpAddress"
                />
              </div>
            </div>
            <div class="mt-4">
              <span class="font-weight-bold" id="lblIp4Netmask">Netmask</span>
              <div>
                <input
                  class="input-text"
                  type="text"
                  name="netmask"
                  v-model="ipv4Netmask"
                  id="txtIpv4Netmask"
                />
              </div>
            </div>
            <div class="mt-4">
              <span class="font-weight-bold" id="lblIp4Gateway">Gateway</span>
              <div>
                <input
                  class="input-text"
                  type="text"
                  name="gateway"
                  v-model="ipv4Gateway"
                  id="txtIP4Gateway"
                />
              </div>
            </div>
          </div>
          <div class="mt-10">
            <v-btn elevation="0" color="udxprimary" @click="gotoNextPage()" id="btnIP4Apply">
              <span class="white--text">Apply and continue</span>
            </v-btn>
            <span
              class="green--text ml-8 pointer"
              @click="$router.push('systemconfig1')"
              id="lblIp4Back"
            >Back to previous step</span>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { mapState } from "vuex";
// import SystemConfigObject from "./../../../../models/system-configuration";
import {
  SystemConfigObject,
  Ipv4
} from "./../../../../models/system-configuration";

@Component({
  name: "eos-network-settings-ipv4"
})
export default class EosNetworkSettingsIpv4 extends Vue {
  public mounted() {
    this.$store.commit("alerts/setOnboardingFlag", false);
  }

  public gotoNextPage() {
    this.updateIpv4Config();
    if (this.$store.getters["systemConfig/isipV6Status"] === true) {
      this.$router.push("systemconfig3");
    } else {
      this.$router.push("dataconfig1");
    }
  }

  public updateIpv4Config() {
    const queryParams: Ipv4 = {
      is_dhcp: false,
      ip_address: this.$data.ipv4IpAddress,
      netmask: this.$data.ipv4Netmask,
      gateway: this.$data.ipv4Gateway
    };
    this.$store
      .dispatch("systemConfig/updateMngmtIpv4", queryParams)
      .then((res: any) => {
        console.log(
          "TCL: EosNetworkSettingsIpv4 -> onboardingData -> res",
          res
        );
      })
      .catch(() => {
        // tslint:disable-next-line: no-console
        console.error("error");
      });
  }
  private data() {
    return {
      ipv4IpAddress: "",
      ipv4Netmask: "",
      ipv4Gateway: "",
      source: "manual",
      systemConfigObject: {} as SystemConfigObject
    };
  }
}
</script>

<style lang="scss" scoped>
.input-text {
  border-style: solid;
  border-width: 1px;
  border-color: #e3e3e3;
  width: 20em;
  height: 2.5em;
}
.pointer {
  cursor: pointer;
}
</style>


