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
  <div class="eos-header-container">
    <div class="eos-header">
      <img
        class="eos-brand-logo"
        :src="require('@/assets/seagate-green.svg/')"
      />
      <div class="eos-logo-separator"></div>
      <img :src="require('@/assets/lyve-drive-green.svg/')" />
      <div class="ml-1 eos-brand-label pr-1">
        <span>RACK</span>
      </div>
      <div class="eos-header-right-aligned-items">
        <eos-has-access
          :to="$eosUserPermissions.alerts + $eosUserPermissions.list"
        >
          <div
            class="eos-logout-icon-container"
            @click="
              $router.push({
                name: 'alerts-large',
                query: { tm: new Date().getTime() }
              })
            "
            v-if="!isRouterPathOnboarding"
          >
            <div v-if="alertNotifications.alertCount > 0">
              <img :src="require('@/assets/navigation/alerts-dot-white.svg')" />
            </div>
            <div v-else>
              <img :src="require('@/assets/navigation/alerts-white.svg')" />
            </div>
          </div>
        </eos-has-access>
        <div style="padding-top: 1.125em;" class="pr-2">
          <label class="eos-username-label">{{ username }}</label>
        </div>
        <div
          class="eos-logout-icon-container"
          @click="logout()"
          v-if="!isRouterPathOnboarding"
        >
          <v-tooltip left max-width="300">
            <template v-slot:activator="{ on }">
              <img :src="require('@/assets/logout.svg/')" v-on="on" />
            </template>
            <span>Logout</span>
          </v-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import store from "../../store/store";
import VueNativeSock from "vue-native-websocket";

@Component({
  name: "HeaderBar"
})
export default class HeaderBar extends Vue {
  public username: string = "";
  public data() {
    return {
      constStr: require("./../../common/const-string.json")
    };
  }
  public mounted() {
    const wsUrl = `wss://${window.location.hostname}:${process.env.VUE_APP_WS_PORT}/ws`;
    Vue.use(VueNativeSock, wsUrl, {
      store,
      format: "json",
      reconnection: true, // (Boolean) whether to reconnect automatically (false)
      reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
      reconnectionDelay: 3000 // (Number) how long to initially wait before attempting a new (1000) })
    });
    this.$store.dispatch("alertDataAction");
    const usernameStr = localStorage.getItem(this.$data.constStr.username);
    if (usernameStr) {
      this.username = usernameStr;
    }
  }

  get isRouterPathOnboarding() {
    return this.$route.name === "onboarding";
  }

  get alertNotifications() {
    return this.$store.state.alertNotification.socket;
  }
  private logout() {
    // Invalidate session from Server, remove localStorage token and re-route to login page
    this.$store.dispatch("userLogin/logoutAction").finally(() => {
      localStorage.removeItem(this.$data.constStr.access_token);
    });
    this.$store.commit("userLogin/setUserPermissions", {});
    localStorage.removeItem(this.$data.constStr.username);
    this.$router.push("/login");
  }
}
</script>

<style lang="scss" scoped>
.eos-header-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 5;
}
.eos-header {
  display: flex;
  flex-wrap: nowrap;
  background-color: #000000;
  height: 4em;
}
.eos-logo-separator {
  margin: 1em 1.206em 1em 1.206em;
  border: 1px solid #454545;
}
.eos-username-label {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: #ffffff;
}
.eos-header-right-aligned-items {
  margin-left: auto;
  display: flex;
  flex-wrap: nowrap;
}
.eos-logout-icon-container {
  padding: 1.125em 1.5em 1.125em 1.5em;
  cursor: pointer;
}
.eos-brand-logo {
  margin-left: 3em;
  margin-right: 1.9em;
}

</style>
