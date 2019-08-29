import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { Module, VuexModule, Mutation, Action, MutationAction } from "vuex-module-decorators";
import AlertObject from "./../../models/alert";

Vue.use(Vuex);

@Module({
    namespaced: true
})
export default class Alerts extends VuexModule {
    public alerts: AlertObject | null = null;

    @Mutation
    public alertDataMutation(payload: AlertObject) {
        this.alerts = { ...payload };
    }

    @Action
    public async alertDataAction() {
        const res = await axios.get("http://localhost:3001");
        const data = res.data;
        this.context.commit("alertDataMutation", data);
    }

    get alertTotalRecordCount() {
        if (this.alerts) {
            return this.alerts.total_records;
        }

        return;
    }

    get alertData() {
        if (this.alerts) {
            return this.alerts.alerts;
        }

        return;
    }
}
