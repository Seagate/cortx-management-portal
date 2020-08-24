/*
* CORTX-CSM: CORTX Management web and CLI interface.
* Copyright (c) 2020 Seagate Technology LLC and/or its Affiliates
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
* please email opensource@seagate.com or cortx-questions@seagate.com.
*/
<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblIpv4Dns">
        Data network settings: IPv4
      </div>
      <div class="mt-3" id="lblIpv4Msg">
        For Manual option, you must configure Virtual IP address and values for
        Node 0 and Node 1.
      </div>
      <div class="mt-3" id="lblMandatoryMsg">
        Fields marked with * are mandatory.
      </div>
      <v-divider class="mt-2" />
      <eosDataNetworkIpv4Config />
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import EosDataNetworkIpv4Config from "./data-network-ipv4-config.vue";

@Component({
  name: "eos-data-network-ipv4",
  components: {
    eosDataNetworkIpv4Config: EosDataNetworkIpv4Config
  }
})
export default class EosDataNetworkIpv4 extends Vue {}
</script>

<style lang="scss" scoped></style>
