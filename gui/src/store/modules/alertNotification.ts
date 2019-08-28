import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// Interface for CSM schema for Alert
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

export default {
    state: {
        // all websockets related state data will be stored in socket state object
        socket: {
            alerts: Array<AlertInfo>(),
            alertCount: Number
        }
    },
    getters: {
    },
    mutations: {
        // will get called when web-socket connection is opened
        SOCKET_ONOPEN(state: any, event: any) {
            Vue.prototype.$socket = event.currentTarget;
        },
        // will get called when web-socket connection is clossed
        SOCKET_ONCLOSE(state: any) {
            return;
        },
        // will get called when error occors in web-socket connection
        SOCKET_ONERROR(state: any, event: any) {
            return;
        },
        // will get called when we recives messages on web-sockets layer
        SOCKET_ONMESSAGE(state: any, message: any) {
            state.socket.alerts.push(message);

        },
        // will get called on web-socket connection reconnect event.
        SOCKET_RECONNECT(state: any, count: any) {
            return;
        },
        // will get called on web-sockets reconnection error.
        SOCKET_RECONNECT_ERROR(state: any) {
            return;
        }
    },
    actions: {
    }
};
