/*****************************************************************************
 Filename:          main.ts
 Description:       Application Bootstrap

 Creation Date:     01/08/2019
 Author:            Piyush Gupte

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import vuetify from "./plugins/vuetify";
import * as moment from "moment";
import "@/common/style.css";
import { errorHandler } from "./common/error-handler";

Vue.config.productionTip = false;
Vue.config.errorHandler = errorHandler;
Vue.filter("timeago", (date: string) => {
  return moment.default(date).fromNow();
});

Vue.filter("capitalize", (value: any) => {
  if (!value) { return ""; }
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
