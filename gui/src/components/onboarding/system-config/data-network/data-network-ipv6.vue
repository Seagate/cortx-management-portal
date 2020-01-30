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
      <div class="title mt-6" id="lblIpv6DNS">Data network settings: IPv6</div>
      <div class="mt-2" id="lblIpv6Msg">
        You need to configure a single IP address for management of this system.
      </div>
      <v-divider class="mt-2" />
      <div class="font-weight-bold mt-6 black--text">Source</div>
      <div class="mt-4">
        <input
          type="radio"
          name="source"
          v-model="source"
          value="manual"
          id="rbtnIpv6Manual"
        />
        <span class="ml-2 font-weight-bold black--text" id="lblIpv6Manual"
          >Manual</span
        >
        <input
          class="ml-6"
          type="radio"
          disabled
          name="DHCP"
          value="DHCP"
          id="rbtnIpv6DHCP"
        />
        <span class="ml-2 font-weight-bold black--text" id="lblIpv6Dhcp"
          >DHCP</span
        >
      </div>
    </div>
    <div class="row mt-5">
      <template v-for="node in ipv6Nodes">
        <div class="col-4 body-2 column" :key="node.id">
          <span class="font-weight-medium black--text" id="lblIpv6Node0"
            >Node {{ node.id }}</span
          >
          <v-divider class="mt-2" />
          <div class="mt-5">
            <span class="font-weight-medium black--text" id="lblIpv6Gateway"
              >Gateway</span
            >
            <div>
              <input
                class="input-text"
                type="text"
                name="gateway"
                v-model="node.gateway"
                :id="node.id + 'txtDataNetworkIpv6gateway'"
              />
            </div>
          </div>
          <div
            class="font-weight-medium mt-8 black--text"
            id="lblIpv6Staticaddress"
          >
            Static address
          </div>
          <v-divider class="mt-2" />
          <v-row
            v-for="(value, i) in node.ip_address"
            :key="value + i"
            class="mt-2"
          >
            <v-col cols="6">{{ value }}</v-col>
            <v-col cols="3">
              <v-img
                @click="deleteIpAddressNode(value, node.id)"
                id="alert-img"
                :src="require('./../../../../assets/actions/delete-green.svg')"
                width="1em"
                height="1em"
              ></v-img>
            </v-col>
          </v-row>
          <div class="mt-4">
            <span class="font-weight-medium black--text" id="lblIPv6Ipadreess"
              >IP address</span
            >
            <div>
              <input
                class="input-text"
                v-model="ipaddressNode[node.id]"
                type="text"
                name="ipaddress"
                :id="node.id + 'txtDataNetworkIpv6ipaddress'"
              />
            </div>
          </div>
          <div
            :class="[
              node.ip_address.length < 4
                ? 'csmprimary--text'
                : 'grey--text lighten-1',
              'pointer',
              'mt-8'
            ]"
            @click="addIpAddressNode(ipaddressNode[node.id], node.id)"
          >
            + Add another static address (maximum of 4)
          </div>
        </div>
      </template>
    </div>
    <div class="mt-8">
      <p v-if="!isValid" class="red--text error-message">
        Please enter valid values.
      </p>
      <v-btn
        elevation="0"
        color="csmprimary"
        @click="gotToNextPage()"
        id="btnIpv6ApplyContinue"
      >
        <span class="white--text">Apply and Continue</span>
      </v-btn>
      <span
        class="csmprimary--text ml-8 pointer"
        @click="gotToPrevPage()"
        id="lblIpv6Back"
        >Back to previous step</span
      >
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import {
  SystemConfigObject,
  DataNetworkIpv6
} from "./../../../../models/system-configuration";

@Component({
  name: "eos-data-network-ipv6"
})
export default class EosDataNetworkIpv6 extends Vue {
  public updateDataNetworkconfig() {
    const queryParams: DataNetworkIpv6 = {
      is_auto: true,
      nodes: this.$data.ipv6Nodes
    };

    return this.$store.dispatch(
      "systemConfig/updateDataNetworkSettingIpv6",
      queryParams
    );
  }
  public mounted() {
    this.managementNetworkGetter();
  }
  public managementNetworkGetter() {
    const systemconfig = this.$store.getters["systemConfig/systemconfig"];
    if (
      systemconfig.data_network_settings &&
      systemconfig.data_network_settings.ipv6 &&
      systemconfig.data_network_settings.ipv6.nodes
    ) {
      this.$data.ipv6Nodes = systemconfig.data_network_settings.ipv6.nodes;
    }
  }
  private gotToNextPage() {
    this.updateDataNetworkconfig()
      .then((res: any) => {
        if (res) {
          this.$router.push("dnsconfig");
        } else {
          this.$data.isValid = false;
        }
      })
      .catch(() => {
        // tslint:disable-next-line: no-console
        console.error("error");
      });
  }

  private gotToPrevPage() {
    if (this.$store.getters["systemConfig/isDataipV4Status"] === true) {
      this.$router.push("dataconfig2");
    } else {
      this.$router.push("dataconfig1");
    }
  }
  private addIpAddressNode(address: string, id: number) {
    if (
      this.$data.ipv6Nodes.length < 4 &&
      address !== "" &&
      address !== undefined
    ) {
      this.$data.ipv6Nodes[id].ip_address.push(address);
      this.$data.ipaddressNode[id] = "";
    }
  }

  private deleteIpAddressNode(address: string, id: number) {
    for (
      let addressIndex = 0;
      addressIndex < this.$data.ipv6Nodes[id].ip_address.length;
      addressIndex++
    ) {
      if (this.$data.ipv6Nodes[id].ip_address[addressIndex] === address) {
        this.$data.ipv6Nodes[id].ip_address.splice(addressIndex, 1);
      }
    }
  }

  private data() {
    return {
      source: "manual",
      ipaddressNode: [],
      ipv6Nodes: [
        {
          id: 0,
          ip_address: [],
          gateway: "",
          address_label: "",
          type: ""
        },
        {
          id: 1,
          ip_address: [],
          gateway: "",
          address_label: "",
          type: ""
        }
      ],
      isValid: true
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
