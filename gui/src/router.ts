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
import EosDataNetwork from "./components/onboarding/system-config/data-network/data-network.vue";
import EosDataNetworkIpv4 from "./components/onboarding/system-config/data-network/data-network-ipv4.vue";
import EosDataNetworkIpv6 from "./components/onboarding/system-config/data-network/data-network-ipv6.vue";
import EosDnsSettings from "./components/onboarding/system-config/dns/dns-setting.vue";
import EosDateTime from "./components/onboarding/system-config/date-time/date-time.vue";
import EosUserSetting from "./components/onboarding/system-config/user-settings/user-setting.vue";
import EosUserSettingLocal from "./components/onboarding/system-config/user-settings/user-setting-local.vue";
import EosUserSettingLdap from "./components/onboarding/system-config/user-settings/user-setting-ldap.vue";
import EosNotifications from "./components/onboarding/system-config/notifications/notifications.vue";
import EosNotificationsEmail from "./components/onboarding/system-config/notifications/notifications-email.vue";
import EosNotificationsSyslog from "./components/onboarding/system-config/notifications/notifications-syslog.vue";
import EosInterfaceSelect from "./components/onboarding/system-config/interface-select/interface-select.vue";
import EosAccountManagement from "./components/s3/account-management.vue";
import EosBucketCreation from "./components/s3/bucket-creation.vue";
import EOSConfigurationSummary from "./components/s3/configuration-summary.vue";
import EosS3Management from "./components/s3/s3.vue";
import EosAdminUser from "./components/preboarding/admin-user.vue";
import EosWelcome from "./components/preboarding/welcome.vue";
import EosLogin from "./components/preboarding/login.vue";
import EosSetting from "./views/setting.vue";
import UDXRegistration from "./components/udx/udx-registration.vue";
import EosSettingsSubmenu from "./components/submenu-options/settings-submenu.vue";
import EosProvisioningSubmenu from "./components/submenu-options/provisioning-submenu.vue";
import EosAutoLogin from "./components/preboarding/auto-login.vue";

Vue.use(Router);

// Note: requiresAuth: Flag for User Logged into the system
//       isOnboardingReq: Flag for on-boarding complete
const router = new Router({
  routes: [
    {
      path: "/",
      name: "login",
      component: EosLogin,
      meta: { requiresAuth: false, isOnboardingReq: false }
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      meta: { requiresAuth: true, isOnboardingReq: true }
    },
    {
      path: "/alertlarge",
      name: "eosAlertLarge",
      component: EosAlertLarge,
      meta: { requiresAuth: true, isOnboardingReq: true }
    },
    {
      path: "/systemconfig1",
      name: "systemconfig1",
      component: EosNetworkSettings,
      meta: { requiresAuth: true, isOnboardingReq: false }
    },
    {
      path: "/systemconfig2",
      name: "systemconfig2",
      component: EosNetworkSettingsIpv4,
      meta: { requiresAuth: true, isOnboardingReq: false }
    },
    {
      path: "/systemconfig3",
      name: "systemconfig3",
      component: EosNetworkSettingsIpv6,
      meta: { requiresAuth: true, isOnboardingReq: false }
    },
    {
      path: "/dataconfig1",
      name: "dataconfig1",
      component: EosDataNetwork,
      meta: { requiresAuth: true, isOnboardingReq: false }
    },
    {
      path: "/dataconfig2",
      name: "dataconfig2",
      component: EosDataNetworkIpv4,
      meta: { requiresAuth: true, isOnboardingReq: false }
    },
    {
      path: "/dataconfig3",
      name: "dataconfig3",
      component: EosDataNetworkIpv6,
      meta: { requiresAuth: true, isOnboardingReq: false }
    },
    {
      path: "/dnsconfig",
      name: "dnsconfig",
      component: EosDnsSettings,
      meta: { requiresAuth: true, isOnboardingReq: false }
    },
    {
      path: "/datetime",
      name: "datetime",
      component: EosDateTime,
      meta: { requiresAuth: true, isOnboardingReq: false }
    },
    {
      path: "/usersetting",
      name: "usersetting",
      component: EosUserSetting,
      meta: { requiresAuth: true, isOnboardingReq: false }
    },
    {
      path: "/usersettinglocal",
      name: "usersettinglocal",
      component: EosUserSettingLocal,
      meta: { requiresAuth: true, isOnboardingReq: false }
    },
    {
      path: "/usersettingldap",
      name: "usersettingldap",
      component: EosUserSettingLdap,
      meta: { requiresAuth: true, isOnboardingReq: false }
    },
    {
      path: "/notifications",
      name: "notifications",
      component: EosNotifications,
      meta: { requiresAuth: true, isOnboardingReq: false }
    },
    {
      path: "/notificationsemail",
      name: "notificationsemail",
      component: EosNotificationsEmail,
      meta: { requiresAuth: true, isOnboardingReq: false }
    },
    {
      path: "/notificationssyslog",
      name: "notificationssyslog",
      component: EosNotificationsSyslog,
      meta: { requiresAuth: true, isOnboardingReq: false }
    },
    {
      path: "/interfaceselect",
      name: "interfaceselect",
      component: EosInterfaceSelect,
      meta: { requiresAuth: true, isOnboardingReq: false }
    },
    {
      path: "/s3account",
      name: "s3account",
      component: EosAccountManagement,
      meta: { requiresAuth: false, isOnboardingReq: false }
    },
    {
      path: "/s3bucketcreation",
      name: "bucketcreation",
      component: EosBucketCreation,
      meta: { requiresAuth: true, isOnboardingReq: false }

    },
    {
      path: "/bucketconfigsummary",
      name: "bucketconfigsummary",
      component: EOSConfigurationSummary,
      meta: { requiresAuth: true, isOnboardingReq: false }

    },
    {
      path: "/s3",
      name: "s3",
      component: EosS3Management,
      meta: { requiresAuth: true, isOnboardingReq: false }
    },
    {
      path: "/adminuser",
      name: "adminuser",
      component: EosAdminUser,
      meta: { requiresAuth: false, isOnboardingReq: false }
    },
    {
      path: "/welcome",
      name: "welcome",
      component: EosWelcome,
      meta: { requiresAuth: false, isOnboardingReq: false }
    },
    {
      path: "/login",
      name: "login",
      component: EosLogin,
      meta: { requiresAuth: false, isOnboardingReq: false }
    },
    {
      path: "/setting",
      name: "setting",
      component: EosSetting,
      meta: { requiresAuth: false, isOnboardingReq: false }
    },
    {
      path: "/udx-registration",
      name: "udx-registration",
      component: UDXRegistration,
      meta: { requiresAuth: true, isOnboardingReq: false }
    },
    {
      path: "/settings-submenu",
      name: "settings-submenu",
      component: EosSettingsSubmenu,
      meta: { requiresAuth: true, isOnboardingReq: false }
    },
    {
      path: "/provisioning-submenu",
      name: "provisioning-submenu",
      component: EosProvisioningSubmenu,
      meta: { requiresAuth: true, isOnboardingReq: false }
    },
    {
      path: "/clouduser",
      name: "clouduser",
      component: EosAutoLogin,
      meta: { requiresAuth: false, isOnboardingReq: false }
    }
  ],
});

// This code executes before any route happens
router.beforeEach((to, from, next) => {
  // TODO: isOnboardingReq flag handling is pending
  if (to.meta.requiresAuth) {
    // This route requires auth, check if logged in
    // if not, redirect to login page.
    const conststr = require("./common/const-string.json");
    const token = localStorage.getItem(conststr.access_token);
    if (!token) {
      next({
        path: "/login"
      });
    } else {
      next();
    }
  } else {
    next(); // make sure to always call next()!
  }
});

export default router;
