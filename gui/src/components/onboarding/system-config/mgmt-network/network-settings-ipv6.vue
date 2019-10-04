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
          <div class="title mt-6">management network settings: IPv6</div>
          <div class="mt-6">You need to configure a single IP address for management of this system.</div>
          <v-divider class="mt-2" />
          <div class="font-weight-bold mt-6">Source</div>
          <div class="mt-4">
            <input type="radio" name="source" value="manual" />
            <span class="ml-3 font-weight-bold">Manual</span>
            <input class="ml-10" type="radio" disabled name="DHCP" value="DHCP" />
            <span class="ml-3 font-weight-bold">DHCP</span>
          </div>
          <div class="mt-4">
            <span class="font-weight-bold">Gateway</span>
            <div>
              <input class="input-text" type="text" name="gatway" />
            </div>
          </div>
          <div class="font-weight-bold mt-6">Static address</div>
          <v-divider class="mt-2" width="300" />
          <v-row v-for="value in ipaddress" :key="value">
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
            <span class="font-weight-bold">IP address</span>
            <div>
              <input class="input-text" v-model="newAddress" type="text" name="ipaddress" />
            </div>
          </div>
          <div
            :class="[$data.ipaddress.length < 4?'green--text':'grey--text lighten-1','pointer','mt-8']"
            @click="addIpAddress(newAddress)"
          >+ Add another static address (maximum of 4)</div>
          <v-divider class="mt-8" />
          <div class="mt-10">
            <v-btn elevation="0" color="green" @click="$router.push('systemconfig4')">
              <span class="white--text">Apply and continue</span>
            </v-btn>
            <span class="green--text ml-8 pointer" @click="gotToPrevPage()">Back to previous step</span>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-network-settings-ipv4"
})
export default class EosNetworkSettingsIpv4 extends Vue {
  public mounted() {
    this.$store.commit("alerts/setOnboardingFlag", false);
  }

  private data() {
    return {
      source: "manual",
      ipaddress: ["10.230.163.142", "10.230.163.144"],
      newAddress: ""
    };
  }
  private addIpAddress(address: string) {
    if (
      this.$data.ipaddress.length < 4 &&
      address !== "" &&
      address !== undefined
    ) {
      this.$data.ipaddress.push(address);
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
      addressIndex < this.$data.ipaddress.length;
      addressIndex++
    ) {
      if (this.$data.ipaddress[addressIndex] === address) {
        this.$data.ipaddress.splice(addressIndex, 1);
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


