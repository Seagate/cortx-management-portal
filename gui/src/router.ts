/*****************************************************************************
 Filename:          router.ts
 Description:       Router

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
import Router from "vue-router";
import Dashboard from "./views/dashboard.vue";
import EosAlertLarge from "./components/dashboard/alert-large.vue";
import EosNetworkSettings from "./components/onboarding/system-config/mgmt-network/network-settings.vue";
import EosNetworkSettingsIpv4 from "./components/onboarding/system-config/mgmt-network/network-settings-ipv4.vue";
import EosNetworkSettingsIpv6 from "./components/onboarding/system-config/mgmt-network/network-settings-ipv6.vue";
import EosDataNetwork from "./components/onboarding/system-config/mgmt-network/data-network.vue";


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: Dashboard,
    },
    {
      path: "/alertlarge",
      name: "eosAlertLarge",
      component: EosAlertLarge,
    },
    {
      path: "/systemconfig1",
      name: "systemconfig1",
      component: EosNetworkSettings,
    },
    {
      path: "/systemconfig2",
      name: "systemconfig2",
      component: EosNetworkSettingsIpv4,
    },
    {
      path: "/systemconfig3",
      name: "systemconfig3",
      component: EosNetworkSettingsIpv6,
    },
    {
      path: "/systemconfig4",
      name: "systemconfig4",
      component: EosDataNetwork,
    },
  ],
});
