<template>
  <v-container class="mt-6 body-2">
    <v-img
      id="alert-img"
      :src="require('./../../../../assets/onboarding-wizard.png')"
      width="780px"
      height="70px"
    ></v-img>
    <v-divider />
    <div>
      <div class="title mt-6" id="lblDns">
        DNS Network Settings
        <v-icon class="green--text" size="20">mdi-help-circle-outline</v-icon>
      </div>
    </div>
    <div class="mt-5">
      <span class="font-weight-bold" id="lblFqdnName">FQDN Name :</span>
      <span class="font-weight-regular" id="lblId">vlan1.seagate.com</span>
    </div>
    <div class="mt-4">
      <span class="font-weight-medium black--text" id="lblHostname">Hostname</span>
      <div>
        <input class="input-text" type="text" name="hostname" v-model="hostname"  id="txtHostname"/>
      </div>
      <v-btn elevation="0" class="mt-5" color="green">
        <span class="white--text" @click="gotToNextPage()" id="btnResetHost">Reset Hostname</span>
      </v-btn>
    </div>
    <v-divider class="mt-5 col-3" />
    <div>
      <div class="font-weight-medium black--text" id="lblDNsServer">DNS Server</div>
      <div class="pt-4 font-weight-regular black--text" id="lblDnsServer1">DNS Server 1</div>
      <div>
        <input class="input-text" type="text" name="hostname" v-model="hostname" id="txtHostname" />
      </div>
      <div
        :class="[$data.ipaddressNode0.length < 3 ? 'green--text':'grey--text lighten-1','pointer','mt-5']"
        @click="addIpAddressNode0(newAddressNode0)"
      >+ Add another static address (maximum of 3)</div>
    </div>
    <v-divider class="mt-5 col-3" />
    <div>
      <div class="font-weight-medium black--text" id="lblSearchDomains">Search Domains</div>
      <div class="pt-4 font-weight-regular black--text" id="lblSerachDomains">Search Domains 1</div>
      <div>
        <input class="input-text" type="text" name="hostname" v-model="hostname"  id="txtHostname"/>
      </div>
      <div
        :class="[$data.ipaddressNode0.length < 3 ? 'green--text':'grey--text lighten-1','pointer','mt-5']"
        @click="addIpAddressNode0(newAddressNode0)"
      >+ Add Search Domain</div>
      <v-btn elevation="0" color="green" class="mt-3">
        <span class="white--text" @click="gotToNextPage()" id="btnClearDns">Clear DNS</span>
      </v-btn>
    </div>
    <v-divider class="mt-8" />
    <div class="mt-8">
      <v-btn elevation="0" color="green" id="btnApplyContinue">
        <span class="white--text" @click="gotToNextPage()">Apply and Continue</span>
      </v-btn>
      <span class="green--text ml-8 pointer" @click="gotToPrevPage()" id="lblBack">Back to previous step</span>
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-dns-setting"
})
export default class EosDnsSetting extends Vue {
  public gotToNextPage() {
    this.$router.push("datetime");
  }
  public gotToPrevPage() {
    this.$router.push("dataconfig3");
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
  private data() {
    return {
      source: "manual",
      ipaddressNode0: []
    };
  }
}
</script>
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
