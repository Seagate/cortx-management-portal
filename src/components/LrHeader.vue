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
  <div class="lr-header pa-3">
    <v-btn text icon color="#000000" @click.stop="$emit('menu-click')">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <img :src="require('@/assets/images/lyve-rack-logo.svg')" class="lr-brand-logo" />
    <div class="flex-filler"></div>

    <div class="header-alert-icon">
      <SgtSvgIcon
        icon="alert-green.svg"
        tooltip="Alerts"
        @click="
          $router.push({
            name: 'alerts',
          })
        "
      />
    </div>

    <LrHeaderDropdown />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LrHeaderDropdown from "./LrHeaderDropdown.vue";
import SgtSvgIcon from "@/lib/components/SgtSvgIcon/SgtSvgIcon.vue";

@Component({
  name: "LrHeader",
  components: { LrHeaderDropdown, SgtSvgIcon },
})
export default class LrHeader extends Vue {
  public alertIconSource() {
    // This function can be used to change the icon source when there are new alerts
    return require("@/assets/images/alert-green.svg");
  }
}
</script>

<style lang="scss" scoped>
.lr-header {
  display: flex;
  align-items: center;
  height: 4rem;
  box-shadow: 0px 4px 4px #f2f2f2;
  z-index: 5;

  .header-alert-icon {
    cursor: pointer;
    margin-right: 1.5em;
    padding-top: 7px;
  }

  .lr-brand-logo {
    height: 20px;
    margin-left: 1em;
  }
}
</style>
