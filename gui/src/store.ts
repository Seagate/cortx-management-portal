import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
//Interface for CSM schema for Alert
export interface AlertInfo {
  time: string;
  alert_type: string;
  status: string;
  location: string;
  healthReason: string;
  comment: string;
  Acknowledge: boolean;
  Resolved: boolean;

}

export default new Vuex.Store({
  state: {
    //all websockets related state data will be stored in socket state object
    socket: {
      alerts: Array<AlertInfo>(),
      alertCount: Number
    },

  },
  mutations: {
    //will get called when web-socket connection is opened
    SOCKET_ONOPEN(state, event) {
      Vue.prototype.$socket = event.currentTarget;
    },
    //will get called when web-socket connection is clossed

    SOCKET_ONCLOSE(state) {
      return;
    },
    //will get called when error occors in web-socket connection
    SOCKET_ONERROR(state, event) {
      return;
    },
    //will get called when we recives messages on web-sockets layer
    SOCKET_ONMESSAGE(state, message) {
      state.socket.alerts.push(message);

    },
    //will get called on web-socket connection reconnect event.
    SOCKET_RECONNECT(state, count) {
      return;
    },
    //will get called on web-sockets reconnection error.
    SOCKET_RECONNECT_ERROR(state) {
      return;
    },

  },
  actions: {

  },
});
