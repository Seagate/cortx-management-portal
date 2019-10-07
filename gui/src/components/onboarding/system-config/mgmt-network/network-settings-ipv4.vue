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
          <div class="title mt-6">Management Network Settings: IPv4</div>
          <div class="mt-6">You need to configure a single IP address for management of this system.</div>
          <v-divider class="mt-2" />
          <div class="font-weight-bold mt-6">Source</div>
          <div class="mt-4">
            <input type="radio" name="source" v-model="source" value="manual" />
            <span class="ml-3 font-weight-bold">Manual</span>
            <input class="ml-10" type="radio" disabled name="DHCP" value="DHCP" />
            <span class="ml-3 font-weight-bold">DHCP</span>
          </div>
          <div>
            <div class="mt-4">
              <span class="font-weight-bold">IP Address</span>
              <div>
                <input class="input-text" type="text" name="ipaddress" v-model="ipv4IpAddress" />
              </div>
            </div>
            <div class="mt-4">
              <span class="font-weight-bold">Netmask</span>
              <div>
                <input class="input-text" type="text" name="netmask" v-model="ipv4Netmask" />
              </div>
            </div>
            <div class="mt-4">
              <span class="font-weight-bold">Gateway</span>
              <div>
                <input class="input-text" type="text" name="gateway" v-model="ipv4Gateway" />
              </div>
            </div>
          </div>
          <div class="mt-10">
            <v-btn elevation="0" color="green" @click="gotoNextPage()">
              <span class="white--text">Apply and continue</span>
            </v-btn>
            <span
              class="green--text ml-8 pointer"
              @click="$router.push('systemconfig1')"
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
import SystemConfigObject from "./../../../../models/system-configuration";

@Component({
  name: "eos-network-settings-ipv4"
})
export default class EosNetworkSettingsIpv4 extends Vue {
  public mounted() {
    this.$store.commit("alerts/setOnboardingFlag", false);
  }

  public gotoNextPage() {
    if (this.$store.getters["systemConfig/isipV6Status"] === true) {
      this.$router.push("systemconfig3");
    } else {
      this.$router.push("systemconfig4");
    }
  }

  public beforeMount() {
    if (this.systemConfigData) {
      this.$data.systemConfigObject.system_config = this.systemConfigData;
    } else {
      this.$data.systemConfigObject.system_config = {
        ipv4: { isManual: true }
      };
    }
  }
  private data() {
    return {
      source: "manual",
      systemConfigObject: {} as SystemConfigObject
    };
  }

  private commitData() {
    this.$store.commit(
      "systemConfig/systemConfigMutation",
      this.$data.systemConfigObject
    );
  }
  get ipv4IpAddress() {
    return this.$store.getters["systemConfig/ipv4IpAddress"];
  }
  set ipv4IpAddress(value) {
    this.$data.systemConfigObject.system_config.ipv4.ipAddress = value;
    this.commitData();
  }
  get ipv4Netmask() {
    return this.$store.getters["systemConfig/ipv4Netmask"];
  }
  set ipv4Netmask(value) {
    this.$data.systemConfigObject.system_config.ipv4.netmask = value;
    this.commitData();
  }
  get ipv4Gateway() {
    return this.$store.getters["systemConfig/ipv4Gateway"];
  }
  set ipv4Gateway(value) {
    this.$data.systemConfigObject.system_config.ipv4.gateway = value;
    this.commitData();
  }
  get systemConfigData() {
    return this.$store.getters["systemConfig/systemConfigData"];
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


