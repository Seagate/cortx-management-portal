/*****************************************************************************
 Filename:          header-bar.vue
 Description:       Header Bar Component

 Creation Date:     01/08/2019
 Author:            Piyush Gupte

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <v-app-bar height="70em" flat class="black" app>
    <span>
      <img src="../../assets/headerBar.png" />
    </span>
    <v-spacer></v-spacer>
    <div id="alert-menu">
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <div v-on="on" class="alert-container">
            <v-img
              id="alert-img"
              :src="require('./../../assets/info-alert-white.png')"
              width="1em"
              height="1em"
            ></v-img>
            <span id="alert-lbl">Alerts</span>
            <div id="alert-count">{{alertNotifications.length}}</div>
          </div>
        </template>
        <v-card width="20em" min-height="14em" max-height="25em" class="mx-auto elevation-0" tile>
          <v-card-text>
            <div>Alerts</div>
          </v-card-text>
          <v-list width="18em" class="mar-center" min-height="12em" max-height="16em">
            <v-list-item v-for="(item, index) in alertNotifications" :key="index">
              <img
                class="mr-2"
                v-if="item.state===alertStatus.missing || item.state === alertStatus.not_installed"
                src="./../../assets/status/critical-icon.png"
              />
              <img
                class="mr-2"
                v-if="item.state=== alertStatus.fault|| item.state == alertStatus.error"
                src="../../assets/status/error-fault.png"
              />
              <img
                class="mr-2"
                v-if="item.state===alertStatus.insertion || item.state === alertStatus.fault_resolved || item.state === alertStatus.up || item.state === alertStatus.ok"
                src="./../../assets/status/healthy-icon.png"
              />
              <v-list-item-content>
                <v-list-item-title>State:{{ item.state }}</v-list-item-title>
                <v-list-item-subtitle v-html="item.location"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-card-text>
            <div class="green--text">See all alerts</div>
          </v-card-text>
        </v-card>
      </v-menu>
    </div>
  </v-app-bar>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import store from "../../store/store";
import VueNativeSock from "vue-native-websocket";

@Component({
  name: "HeaderBar"
})
export default class HeaderBar extends Vue {
  public data() {
    return {
      alertStatus: require("./../../common/const-string.json")
    };
  }
  public mounted() {
    Vue.use(VueNativeSock, "ws://" + window.location.hostname + ":8081/", {
      store,
      format: "json",
      reconnection: true, // (Boolean) whether to reconnect automatically (false)
      reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
      reconnectionDelay: 3000 // (Number) how long to initially wait before attempting a new (1000) })
    });
  }

  get alertNotifications() {
    return this.$store.state.alertNotification.socket.alerts;
  }
}
</script>

<style lang="scss" scoped>
.alert-container {
  cursor: pointer;
  color: white;

  #alert-img {
    position: relative;
    top: 1.1em;
    right: 1.2em;
  }

  #alert-count {
    background-color: red;
    color: white;
    display: inline-block;
    margin-left: 0.2em;
    min-width: 1em;
    min-height: 1em;
    text-align: center;
    padding: 0 0.2em 0 0.2em;
  }
}

.v-card {
  overflow: hidden;
}

.v-app-bar {
  height: 4.2em !important;
}
.v-list {
  border: 1px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.12) !important;
  margin: auto;
  overflow-y: auto !important;

  .v-list-item {
    border-bottom: 1px;
    border-bottom-style: solid;
    border-bottom-color: rgba(0, 0, 0, 0.12) !important;
  }

  .v-list-item:last-child {
    border-bottom: 0px;
  }
}
</style>


