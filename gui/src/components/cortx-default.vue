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
  <div>
    <header-bar />
    <div>
      <cortx-nav-bar v-if="!isRouterPathOnboading" />
      <div class="header-margin" :class="{'navbar-margin':!isRouterPathOnboading}">
        <router-view></router-view>
      </div>
    </div>
    <CortxMessageDialog />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HeaderBar from "./header/header-bar.vue";
import CortxNavBar from "./navigation/nav-bar.vue";
import { SystemConfigObject } from "../models/system-configuration";
import CortxMessageDialog from "./widgets/cortx-message-dialog.vue";

@Component({
  name: "Default",
  components: {
    HeaderBar,
    CortxNavBar,
    CortxMessageDialog
  }
})
export default class CortxDefault extends Vue {
  get isRouterPathOnboading() {
    return this.$route.name === "onboarding";
  }
}
</script>

<style lang="scss" scoped>
.header-margin {
  margin-top: 3.75em;
}
.navbar-margin {
  margin-left: 11.25em;
}
</style>
