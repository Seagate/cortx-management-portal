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
      <div class="title mt-6">Data Network Settings: IPv6</div>
      <div class="mt-2">You need to configure a single IP address for management of this system.</div>
      <v-divider class="mt-2" />
      <div class="font-weight-bold mt-6 black--text">
        Source
        <v-icon class="green--text" size="20">mdi-help-circle-outline</v-icon>
      </div>
      <div class="mt-4">
        <input type="radio" name="source" v-model="source" value="manual" />
        <span class="ml-2 font-weight-bold black--text">Manual</span>
        <input class="ml-6" type="radio" disabled name="DHCP" value="DHCP" />
        <span class="ml-2 font-weight-bold black--text">DHCP</span>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-4 body-2 column">
        <span class="font-weight-medium black--text">Node 0</span>
        <v-divider class="mt-2" />
        <div class="mt-5">
          <span class="font-weight-medium black--text">Gateway</span>
          <div>
            <input class="input-text" type="text" name="ipaddress" v-model="ipv4IpAddress" />
          </div>
        </div>
        <div class="font-weight-medium mt-8 black--text">Static address</div>
        <v-divider class="mt-2" />
        <v-row v-for="value in ipaddressNode0" :key="value" class="mt-2">
          <v-col cols="6">{{value}}</v-col>
          <v-col cols="3">
            <v-img
              @click="deleteIpAddressNode0(value)"
              id="alert-img"
              :src="require('./../../../../assets/delete-off.png')"
              width="1em"
              height="1em"
            ></v-img>
          </v-col>
        </v-row>
        <div class="mt-4">
          <span class="font-weight-medium black--text">IP address</span>
          <div>
            <input class="input-text" v-model="newAddressNode0" type="text" name="ipaddress" />
          </div>
        </div>
        <div
          :class="[$data.ipaddressNode0.length < 4 ? 'green--text':'grey--text lighten-1','pointer','mt-8']"
          @click="addIpAddressNode0(newAddressNode0)"
        >+ Add another static address (maximum of 4)</div>
      </div>
      <div class="col-4 body-2 column">
        <span class="font-weight-medium black--text">Node 1</span>
        <v-divider class="mt-2" />
        <div class="mt-5">
          <span class="font-weight-medium black--text">Gateway</span>
          <div>
            <input class="input-text" type="text" name="ipaddressNode0" v-model="ipv4IpAddress" />
          </div>
        </div>
        <div class="font-weight-medium mt-8 black--text">Static Addresses</div>
        <v-divider class="mt-2" />
        <v-row v-for="value in ipaddressNode1" :key="value" class="mt-2">
          <v-col cols="6">{{value}}</v-col>
          <v-col cols="3">
            <v-img
              @click="deleteIpAddressNode1(value)"
              id="alert-img"
              :src="require('./../../../../assets/delete-off.png')"
              width="1em"
              height="1em"
            ></v-img>
          </v-col>
        </v-row>
        <div class="mt-4">
          <span class="font-weight-medium black--text">IP address</span>
          <div>
            <input class="input-text" v-model="newAddressNode1" type="text" name="ipaddressNode1" />
          </div>
        </div>

        <div
          :class="[$data.ipaddressNode1.length < 4?'green--text':'grey--text lighten-1','pointer','mt-8']"
          @click="addIpAddressNode1(newAddressNode1)"
        >+ Add another static address (maximum of 4)</div>
      </div>
    </div>
    <div class="mt-8">
      <v-btn elevation="0" color="green">
        <span class="white--text" @click="gotToNextPage()">Apply and Continue</span>
      </v-btn>
      <span class="green--text ml-8 pointer" @click="gotToPrevPage()">Back to previous step</span>
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-data-network-ipv6"
})
export default class EosDataNetworkIpv6 extends Vue {
  private gotToNextPage() {
    this.$router.push("dnsconfig");
  }
  private gotToPrevPage() {
    this.$router.push("dataconfig2");
  }
  private addIpAddressNode0(address: string) {
    if (
      this.$data.ipaddressNode0.length < 4 &&
      address !== "" &&
      address !== undefined
    ) {
      this.$data.ipaddressNode0.push(address);
      this.$data.newAddressNode0 = "";
    }
  }
  private addIpAddressNode1(address: string) {
    if (
      this.$data.ipaddressNode1.length < 4 &&
      address !== "" &&
      address !== undefined
    ) {
      this.$data.ipaddressNode1.push(address);
      this.$data.newAddressNode1 = "";
    }
  }
  private deleteIpAddressNode0(address: string) {
    for (
      let addressIndex = 0;
      addressIndex < this.$data.ipaddressNode0.length;
      addressIndex++
    ) {
      if (this.$data.ipaddressNode0[addressIndex] === address) {
        this.$data.ipaddressNode0.splice(addressIndex, 1);
      }
    }
  }
  private deleteIpAddressNode1(address: string) {
    for (
      let addressIndex = 0;
      addressIndex < this.$data.ipaddressNode1.length;
      addressIndex++
    ) {
      if (this.$data.ipaddressNode1[addressIndex] === address) {
        this.$data.ipaddressNode1.splice(addressIndex, 1);
      }
    }
  }
  private data() {
    return {
      source: "manual",
      ipaddressNode0: [],
      ipaddressNode1: [],
      newAddressNode0: "",
      newAddressNode1: ""
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
