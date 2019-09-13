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
  <v-app-bar height="70" flat class="black" app>
    <span>
      <img src="../../assets/headerBar.png" />
    </span>
    <v-spacer></v-spacer>
    <div id="alert-menu">
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <div v-on="on" class="alert-container">
            <div id="alert-img"></div>
            <span id="alert-lbl">Alerts</span>
            <div id="alert-count">{{alertNotifications.length}}</div>
          </div>
        </template>
        <v-card width="350px" min-height="200px" max-height="400px" class="mx-auto">
          <v-card-text>
            <div>Alerts</div>
          </v-card-text>
          <v-list width="300px" class="mar-center" min-height="200px" max-height="257px">
            <v-list-item v-for="(item, index) in alertNotifications" :key="index">
              <img
                class="mr-2"
                v-if="item.state=='missing'"
                src="./../../assets/status/critical-icon.png"
              />
              <img
                class="mr-2"
                v-if="item.state=='fault'"
                src="../../assets/status/error-fault.png"
              />
              <img
                class="mr-2"
                v-if="item.state=='insertion' || item.state=='fault resolved'"
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
    return {};
  }
  public mounted() {
    Vue.use(VueNativeSock, "ws://"+window.location.hostname+":8081/", {
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
    width: 25px;
    height: 25px;
    top: 22px;
    right: 22%;
    bottom: 25px;
    background: url("./../../assets/info-alert-white.png") no-repeat;
  }
  #alert-lbl {
    margin-left: 10px;
  }

  #alert-count {
    background-color: red;
    color: white;
    display: inline-block;
    margin-left: 6px;
    min-width: 15px;
    min-height: 15px;
    text-align: center;
    padding: 0 3px 0 3px;
  }
}
.alert-container:hover #alert-img {
  background: url("./../../assets/info-alert-green.png") no-repeat;
}
.alert-container:hover #alert-count {
  color: green;
}
.alert-container:hover #alert-lbl {
  color: green;
}

.v-card {
  overflow: hidden;
}

.v-app-bar {
  height: 70px !important;
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


