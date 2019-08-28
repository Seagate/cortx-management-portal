import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { Module, VuexModule, Mutation, Action, MutationAction } from "vuex-module-decorators";

Vue.use(Vuex);

// Interface for CSM schema for Alert
export interface ExtendedInfo {
    fields: string;
}

export interface Alert {
    id: string;
    alert_uuid: string;
    type: string;
    state: string;
    created_time: string;
    updated_time: string;
    resolved: string;
    acknowledged: string;
    severity: string;
    resource_type: string;
    enclosure_id: string;
    module_type: string;
    module_name: string;
    description_id: string;
    description: string;
    health: string;
    health_recomendation_id: string;
    health_recomendation: string;
    extended_info: ExtendedInfo;
}

export interface AlertObject {
    total_records: number;
    alerts: Alert[];
}

@Module({
    namespaced: true
})
export default class Alerts extends VuexModule {
    public alerts: AlertObject;

    @Mutation
    public alertDataMutation(payload: AlertObject) {
        console.log("*** " + JSON.stringify(payload));
        this.alerts = { ...payload };
        Vue.set(this.alerts, "total_records", 200);
        console.log(this.alerts.total_records);
    }


    @Action
    public async alertDataAction() {
        const res = await axios.get("http://localhost:3001");
        const data = res.data;
        console.log(JSON.stringify(data));
        this.context.commit("alertDataMutation", data);
    }

    get alertTotalRecordCount() {
        if (this.alerts) {
            return this.alerts.total_records;
        }
        return "No records";
    }
}
