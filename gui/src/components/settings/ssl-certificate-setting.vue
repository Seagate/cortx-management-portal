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
  <div class="cortx-p-2 body-2">
    <div class="cortx-text-lg mt-2 font-weight-bold" id="lblSSLUpload">
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
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import CortxUploadSSLConfig from "../onboarding/system-config/ssl-certificate/upload-ssl-config.vue";

@Component({
  name: "upload-ssl-setting",
  components: {
    cortxUploadSSLConfig: CortxUploadSSLConfig
  }
})
export default class CortxUploadSSLSetting extends Vue {}
</script>
<style lang="scss" scoped></style>
