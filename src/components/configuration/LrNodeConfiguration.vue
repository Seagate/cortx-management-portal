<!--
* CORTX-CSM: CORTX Management web.
* Copyright (c) 2022 Seagate Technology LLC and/or its Affiliates
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU Affero General Public License for more details.
* You should have received a copy of the GNU Affero General Public License
* along with this program. If not, see <https://www.gnu.org/licenses/>.
* For any questions about this software or licensing,
* please email opensource@seagate.com.
-->
<template>
  <div class="node-configuration-container">
    <div class="page-title">
      Node
      <SgtTooltipIcon>
        Configure network settings and reset node admin password for a node.
      </SgtTooltipIcon>
    </div>
    <v-divider></v-divider>

    <div class="node-selection-section">
      <v-row class="field-row">
        <v-col cols="3" class="field-label"> Node </v-col>
        <v-col cols="4">
          <SgtDropdown
            :dropdownOptions="nodeOptions"
            placeholder="Node"
            v-model="selectedNode"
          />
        </v-col>
      </v-row>
    </div>

    <v-expansion-panels v-model="panel">
      <v-expansion-panel>
        <v-expansion-panel-header><b> Network </b></v-expansion-panel-header>
        <v-expansion-panel-content class="panel-content">
          <v-row class="field-row">
            <v-col cols="3" class="field-label">
              IP Address
              <SgtTooltipIcon>
                This is IPv4 32 bit address in dotted decimal notation. E.g.
                192.168.111.4.
              </SgtTooltipIcon>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="network.ipAddress"
                placeholder="IP Address"
                outlined
                dense
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="field-row">
            <v-col cols="3" class="field-label">
              Netmask
              <SgtTooltipIcon>
                This is IPv4 32 bit address in dotted decimal notation. E.g.
                255.255.255.0.
              </SgtTooltipIcon>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="network.netmask"
                placeholder="Netmask"
                outlined
                dense
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="field-row">
            <v-col cols="3" class="field-label">
              DNS Servers
              <SgtTooltipIcon>
                Comma separated list of domain name servers. E.g. 199.85.127.30,
                80.248.72.1
              </SgtTooltipIcon>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="network.dnsServers"
                placeholder="DNS Servers"
                outlined
                dense
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="field-row">
            <v-col cols="3" class="field-label">
              Search Domains
              <SgtTooltipIcon>
                Comma separated list of search domains. E.g. example.com,
                another.com
              </SgtTooltipIcon>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="network.searchDomains"
                placeholder="Search Domains"
                outlined
                dense
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row class="field-row">
            <v-col cols="3"></v-col>
            <v-col cols="4" class="button-col">
              <v-btn class="mr-5" color="primary" @click="applyLimit" dark
                >Apply
              </v-btn>
              <v-btn color="csmdisabled" @click="resetLimit" depressed dark
                >Reset</v-btn
              >
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>
          <b>
            Reset Node Admin Password
            <SgtTooltipIcon>
              Generate a new password for the node admin user.
            </SgtTooltipIcon>
          </b>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="panel-content">
          <v-row class="field-row">
            <v-col cols="3" class="field-label"> New Password </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="password.newPassword"
                placeholder="New Password"
                outlined
                dense
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="field-row">
            <v-col cols="3" class="field-label"> Confirm New Password </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="password.confirmNewPassword"
                placeholder="Confirm New Password"
                outlined
                dense
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row class="field-row">
            <v-col cols="3"></v-col>
            <v-col cols="4" class="button-col">
              <v-btn
                class="mr-5"
                color="primary"
                @click="resetNodeAdminPassword"
                dark
                >Apply
              </v-btn>
              <v-btn color="csmdisabled" @click="clearPassword" depressed dark
                >Clear</v-btn
              >
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import SgtTooltipIcon from "@/lib/components/SgtTooltipIcon/SgtTooltipIcon.vue";
import SgtDropdown from "@/lib/components/SgtDropdown/SgtDropdown.vue";
import { Api } from "../../services/Api";
@Component({
  name: "LrNodeConfiguration",
  components: { SgtTooltipIcon, SgtDropdown },
})
export default class LrNodeConfiguration extends Vue {
  selectedNode = {} as { label: string; value: string };
  panel = 0;
  network = {
    ipAddress: null,
    netmask: null,
    dnsServers: null,
    searchDomains: null,
  };
  initialNetworkValue = {
    ipAddress: null,
    netmask: null,
    dnsServers: null,
    searchDomains: null,
  };
  password = {
    newPassword: "",
    confirmNewPassword: "",
  };
  nodeOptions = [];

  async mounted() {
    const nodeListRes: any = await Api.getData("maintenance/node-list", {
      isDummy: true,
    });
    this.nodeOptions = nodeListRes.data.map((datum: any) => ({
      label: datum.name,
      value: datum.id,
    }));
    this.selectedNode = this.nodeOptions[0];
    this.setNetworkValues();
  }

  async setNetworkValues() {
    const networkInfoRes: any = await Api.getData("config/network-info", {
      isDummy: true,
    });

    let { ipAddress, netmask, dnsServers, searchDomains } =
      networkInfoRes.data.find(
        (datum: any) => datum.node.id === this.selectedNode.value
      );
    this.network = {
      ipAddress,
      netmask,
      dnsServers,
      searchDomains,
    };
  }

  resetNodeAdminPassword() {
    //API call to reset the node admin password.
  }

  clearPassword() {
    this.password = {
      newPassword: "",
      confirmNewPassword: "",
    };
  }

  @Watch("selectedNode")
  nodeChangeHandler() {
    this.setNetworkValues();
  }
}
</script>
<style lang="scss" scoped>
.node-configuration-container {
  .page-title {
    font-weight: bold;
    font-size: 1.2rem;
    padding: 1rem 0;
  }

  .node-selection-section {
    padding: 3rem 3.5rem 1rem;
  }

  .page-sub-title {
    font-weight: bold;
    padding: 1rem 1.5rem;
  }
  .field-label {
    font-weight: bold;
  }
  .v-expansion-panel-header,
  .v-expansion-panel-content {
    box-shadow: 0px 2px 0px 0px #e5e5e5;
    border: 1px solid #e5e5e5;
  }

  .panel-content {
    border-top: 2px solid $border;
    border-right: 2px solid $border;
    padding-top: 3rem;
    padding-bottom: 1rem;

    .field-row {
      padding: 0 2rem;
    }
    .button-col {
      margin-top: 2rem;
    }
  }
}
</style>
