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
  <v-container class="pa-0 ma-0 col-12 black black-container-height">
    <div class="cortx-header pl-10 py-3">
      <div class="cortx-brand-logo"></div>
    </div>
    <v-divider class="mx-0 grey darken-3"></v-divider>
    <v-container class="black px-10 pt-5" fluid>
      <div class="ml-4 white--text my-10" style="font-size: 26px;">
        Welcome to LyveDrive Rack.
      </div>
      <div class="ml-4 mt-1 mb-8 white--text" id="welcome-pagetext">
        Click on Start to proceed with on onboarding steps.
      </div>
      <button
        id="welcome-startbtn"
        type="button"
        class="cortx-btn-primary-dark ml-4"
        @click="$router.push('gdpr')"
      >
        <span>Start</span>
      </button>
    </v-container>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "cortx-get-started"
})
export default class CortxWelcome extends Vue {}
</script>

<style lang="scss" scoped></style>
