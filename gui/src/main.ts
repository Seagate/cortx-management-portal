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
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import vuetify from "./plugins/vuetify";
import * as moment from "moment";
import "@/common/style.css";
import { errorHandler } from "./common/error-handler";
import Vuelidate from "vuelidate";
import CortxHasAccess from "./components/security/has-access.vue";
import { userPermissions as userPermissionsMap } from "./common/user-permissions-map";
import CortxInfoTooltip from "./components/widgets/cortx-info-tooltip.vue";
import CortxConfirmationDialog from "./components/widgets/cortx-confirmation-dialog.vue";
import CortxDropdown from "./components/widgets/dropdown/cortx-dropdown-view.vue";
import i18n from "./i18n";

Vue.use(Vuelidate);
Vue.config.productionTip = false;
Vue.config.errorHandler = errorHandler;
Vue.filter("timeago", (date: string) => {
  return moment.default(date).format("DD-MM-YYYY hh:mm A");
});

export const EVENT_BUS = new Vue();
Vue.filter("capitalize", (value: any) => {
  if (value) {
    value = value.toString();
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
});

Vue.prototype.$hasAccessToCsm = function(role: string) {
  if (!role) {
    return false;
  }
  const [resource, action] = role.split(":");
  const userPermissions = this.$store.getters["userLogin/getUserPermissions"];
  if (
    userPermissions &&
    userPermissions[resource] &&
    userPermissions[resource][action]
  ) {
    return true;
  }
  return false;
};

Vue.prototype.$getFeatureList = function() {
  const unsupportedFeatures = this.$store.getters["userLogin/getUnsupportedFeatures"];
  return unsupportedFeatures;
};

Vue.directive("feature", function(el, binding, vnode) {
  const routerApp: any = router.app.$root;
  const unsupportedFeatures = routerApp.$getFeatureList();
  if (unsupportedFeatures && unsupportedFeatures[binding.value]) {
    el.style.display = "none";
  }
});

Vue.component("cortx-has-access", CortxHasAccess);
Vue.component("cortx-info-tooltip", CortxInfoTooltip);
Vue.component("cortx-confirmation-dialog", CortxConfirmationDialog);
Vue.component("cortx-dropdown", CortxDropdown);

Vue.prototype.$cortxUserPermissions = userPermissionsMap;

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount("#app");
