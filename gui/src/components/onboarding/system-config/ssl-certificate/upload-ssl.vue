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
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblSSLUpload">
        {{ $t("onBoarding.sslCertificateUpload") }}
      </div>
      <div class="mt-3" id="lblSSLUploadMsg">
        {{ $t("onBoarding.sslCertificateUploadMsg") }}
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
import i18n from "../../onboarding.json";

@Component({
  name: "uploade-ssl",
  components: {
    cortxUploadSSLConfig: CortxUploadSSLConfig
  },
  i18n: {
    messages: i18n
  }
})
export default class CortxUploadSSL extends Vue {}
</script>
<style lang="scss" scoped></style>
