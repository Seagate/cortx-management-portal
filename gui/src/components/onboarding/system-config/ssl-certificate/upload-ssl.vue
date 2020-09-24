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
  <v-container>
    <div>
      <div class="title mt-0 font-weight-bold" id="lblSSLUpload">
        SSL certificate upload
      </div>
      <div class="mt-3" id="lblSSLUploadMsg">
        By default, the system uses the SSL certificate provided by Seagate. To
        use a different SSL certificate, click Choose File to browse and select
        the appropriate SSL Certificate file. Click Upload certificate to upload
        the selected SSL certificate.
      </div>
      <v-divider class="mt-2" />
      <cortxUploadSSLConfig />
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import {
  SystemConfigObject,
  DnsNetworkSettings
} from "./../../../../models/system-configuration";
import { EVENT_BUS } from "./../../../../main";
import { Validations } from "vuelidate-property-decorators";
import {
  required,
  helpers,
  sameAs,
  ipAddress,
  requiredIf
} from "vuelidate/lib/validators";
import CortxUploadSSLConfig from "./upload-ssl-config.vue";

@Component({
  name: "uploade-ssl",
  components: {
    cortxUploadSSLConfig: CortxUploadSSLConfig
  }
})
export default class CortxUploadSSL extends Vue {}
</script>
<style lang="scss" scoped></style>
