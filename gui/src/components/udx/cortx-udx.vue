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
  <div class="cortx-p-1" v-feature="constString.lyve_pilot">
    <CortxUDXDetails v-if="udx" :udx="udx" />
    <CortxUDXRegistration v-if="showUDXRegistrationForm" @complete="registrationComplete()" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { UDX } from "../../models/udx";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import CortxUDXDetails from "./cortx-udx-details.vue";
import CortxUDXRegistration from "./cortx-udx-registration.vue";

@Component({
  name: "cortx-udx",
  components: { CortxUDXDetails, CortxUDXRegistration }
})
export default class CortxUDX extends Vue {
  public udx: UDX | null = null;
  public isUDXRegistered: boolean = false;
  public showUDXRegistrationForm: boolean = false;

  public data() {
    return {
      constString: require("../../common/const-string.json")
    };
  }

  public async mounted() {
    await this.getRegistrationStatus();
    if (this.isUDXRegistered) {
      await this.getUDXDetails();
    } else {
      this.showUDXRegistrationForm = true;
    }
  }

  public async getUDXDetails() {
    this.$store.dispatch("systemConfig/showLoader", "Fetching UDX details...");
    const res = await Api.getAll(apiRegister.udx_device);
    if (res && res.data && res.data.length > 0) {
      this.udx = res.data[0];
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public async registrationComplete() {
    this.showUDXRegistrationForm = false;
    await this.getUDXDetails();
  }

  private async getRegistrationStatus() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Checking registration status..."
    );
    try {
      const res = await Api.getAll(apiRegister.udx_registration);
      this.isUDXRegistered = true;
    } catch (e) {
      this.isUDXRegistered = false;
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }
}
</script>
<style lang="scss" scoped>
</style>
