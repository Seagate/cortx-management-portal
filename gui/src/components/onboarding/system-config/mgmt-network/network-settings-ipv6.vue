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
          <div class="title mt-6" id="lblIp6MNS">Management Network Settings: IPv6</div>
          <div
            class="mt-6"
            id="lblIPMsg"
          >You need to configure a single IP address for management of this system.</div>
          <v-divider class="mt-2" />
          <div class="font-weight-bold mt-6">
            Source
            <v-icon class="green--text" size="20">mdi-help-circle-outline</v-icon>
          </div>
          <div class="mt-4">
            <input type="radio" name="source" value="manual" id="rbtnIp6Source" />
            <span class="ml-3 font-weight-bold">Manual</span>
            <input class="ml-10" type="radio" disabled name="DHCP" value="DHCP" id="rbtnIp6Source" />
            <span class="ml-3 font-weight-bold" id="lblIp6DHCP">DHCP</span>
          </div>
          <div class="mt-4">
            <span class="font-weight-bold" id="lblIp4Gateway">Gateway</span>
            <div>
              <input
                class="input-text"
                type="text"
                name="gateway"
                v-model="ipv6Gateway"
                id="txtIP6Gatway"
              />
            </div>
          </div>
          <div class="font-weight-bold mt-6" id="lblIp4StaticAddress">Static address</div>
          <v-divider class="mt-2" width="300" />
          <v-row v-for="(value,i) in staticIpList" :key="value+i">
            <v-col cols="6">{{value}}</v-col>
            <v-col cols="3">
              <v-img
                @click="deleteIpAddress(value)"
                id="alert-img"
                :src="require('./../../../../assets/delete-off.png')"
                width="1em"
                height="1em"
              ></v-img>
            </v-col>
          </v-row>
          <div class="mt-4">
            <span class="font-weight-bold" id="lblIp6Adress">IP address</span>
            <div>
              <input
                class="input-text"
                v-model="newAddress"
                type="text"
                name="staticIpList"
                id="txtIP6Ipaddress"
              />
            </div>
          </div>
          <div
            :class="[$data.staticIpList.length < 4?'green--text':'grey--text lighten-1','pointer','mt-8']"
            @click="addIpAddress(newAddress)"
          >+ Add another static address (maximum of 4)</div>
          <v-divider class="mt-8" />
          <div class="mt-10">
            <v-btn elevation="0" color="udxprimary" @click="gotoNextPage()" id="btnIp6Apply">
              <span class="white--text">Apply and continue</span>
            </v-btn>
            <span
              class="green--text ml-8 pointer"
              @click="gotToPrevPage()"
              id="lblIp6Back"
            >Back to previous step</span>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import {
  SystemConfigObject,
  Ipv6
} from "./../../../../models/system-configuration";

@Component({
  name: "eos-network-settings-ipv4"
})
export default class EosNetworkSettingsIpv4 extends Vue {
  public gotoNextPage() {
    this.updateIpv6Config();
    this.$router.push("dataconfig1");
  }
  public mounted() {
    this.managementNetworkGetter();
    this.$store.commit("alerts/setOnboardingFlag", false);
  }
  public managementNetworkGetter(): any {
    const IPv6Data = this.$store.getters["systemConfig/systemconfig"];
    if (
      IPv6Data.management_network_settings &&
      IPv6Data.management_network_settings.ipv6
    ) {
      this.$data.ipv6Gateway =
        IPv6Data.management_network_settings.ipv6.gateway;
      this.$data.staticIpList =
        IPv6Data.management_network_settings.ipv6.ip_address;
    }
  }
  public updateIpv6Config() {
    // this.$data.staticIpList.push(this.$data.newAddress);
    const queryParams: Ipv6 = {
      is_dhcp: false,
      ip_address: this.$data.staticIpList,
      gateway: this.$data.ipv6Gateway,
      address_label: "vlan",
      type: ""
    };

    this.$store
      .dispatch("systemConfig/updateMngmtIpv6", queryParams)
      .then((res: any) => {})
      .catch(() => {
        // tslint:disable-next-line: no-console
        console.error("error");
      });
  }
  private data() {
    return {
      source: "manual",
      staticIpList: [],
      newAddress: "",
      ipv6Gateway: ""
    };
  }
  private addIpAddress(address: string) {
    if (
      this.$data.staticIpList.length < 4 &&
      address !== "" &&
      address !== undefined
    ) {
      this.$data.staticIpList.push(address);
      this.$data.newAddress = "";
    }
  }
  private gotToPrevPage() {
    if (this.$store.getters["systemConfig/isipV4Status"] === true) {
      this.$router.push("systemconfig2");
    } else {
      this.$router.push("systemconfig1");
    }
  }
  private deleteIpAddress(address: string) {
    for (
      let addressIndex = 0;
      addressIndex < this.$data.staticIpList.length;
      addressIndex++
    ) {
      if (this.$data.staticIpList[addressIndex] === address) {
        this.$data.staticIpList.splice(addressIndex, 1);
      }
    }
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
