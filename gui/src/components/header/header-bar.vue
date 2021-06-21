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
    <div class="cortx-header-container">
      <div class="cortx-header py-3">
        <div class="cortx-brand-logo"></div>
        <div class="cortx-header-right-aligned-items">
          <cortx-has-access
            :to="$cortxUserPermissions.alerts + $cortxUserPermissions.list"
          >
            <div
              class="cortx-logout-icon-container pr-9"
              @click="
                $router.push({
                  name: 'alerts-large',
                  query: { tm: new Date().getTime() }
                })
              "
              v-if="!isRouterPathOnboarding"
            >
              <div v-if="alertNotifications.alertCount > 0">
                <img
                  :src="require('@/assets/navigation/alerts-dot-white.svg')"
                  id="alert-dotwhite"
                />
              </div>
              <div v-else>
                <img
                  :src="require('@/assets/navigation/alerts-white.svg')"
                  id="alert-whiteicon"
                />
              </div>
            </div>
          </cortx-has-access>
          <cortx-header-dropdown></cortx-header-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import store from "../../store/store";
import VueNativeSock from "vue-native-websocket";
import i18n from "../../i18n";
import cortxHeaderDropdown from "./cortx-header-dropdown.vue";

@Component({
  name: "HeaderBar",
  components: { cortxHeaderDropdown }
})
export default class HeaderBar extends Vue {
  public mounted() {
    const wsUrl = `wss://${window.location.hostname}:${process.env.VUE_APP_WS_PORT}/ws`;
    Vue.use(VueNativeSock, wsUrl, {
      store,
      format: "json",
      reconnection: true, // (Boolean) whether to reconnect automatically (false)
      reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
      reconnectionDelay: 3000 // (Number) how long to initially wait before attempting a new (1000) })
    });
  }

  get isRouterPathOnboarding() {
    return this.$route.name === "onboarding";
  }

  get alertNotifications() {
    return this.$store.state.alertNotification.socket;
  }
}
</script>

<style lang="scss" scoped>
.cortx-header-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 5;
}
.cortx-header-right-aligned-items {
  margin-left: auto;
  display: flex;
  flex-wrap: nowrap;
}
.cortx-logout-icon-container {
  padding: 0 0 1.125em 0.625em;
  cursor: pointer;
}
</style>
