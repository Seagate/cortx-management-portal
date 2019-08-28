import Vue from "vue";
import Vuex from "vuex";
import alertNotification from "./modules/alertNotification";
import alerts from "./modules/alerts";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        alertNotification,
        alerts
    }
});
