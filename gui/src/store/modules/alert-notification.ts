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
import Vue from "vue";
import Vuex from "vuex";
import { Api } from "./../../services/api";
import apiRegister from "./../../services/api-register";
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
            alertCount: 0
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
            state.socket.alerts.unshift(message);
            state.socket.alertCount++;

        },
        // will get called on web-socket connection reconnect event.
        SOCKET_RECONNECT(state: any, count: any) {
            return;
        },
        // will get called on web-sockets reconnection error.
        SOCKET_RECONNECT_ERROR(state: any) {
            return;
        },
        apiNotification(state: any, list: any) {
            // tslint:disable-next-line: prefer-for-of
            for (let alertCount = 0; alertCount < list.alerts.length; alertCount++) {
                state.socket.alerts.push(list.alerts[alertCount]);
            }
            state.socket.alertCount = list.total_records;
        }
    },
    actions: {
        async alertDataAction(context: any) {
            const queryParams = {
                sortby: "created_time",
                dir: "desc",
                offset: 1,
                limit: 5,
                acknowledged: false,
                resolved: false
            };
            try {
                const res = await Api.getAll(apiRegister.all_alerts, queryParams);
                const data = res.data;
                context.commit("apiNotification", data);
            } catch (e) {
                // tslint:disable-next-line: no-console
                console.log("err logger: ", e);
            }
        }
    }
};
