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
import EosUserSettingLocal from "./components/onboarding/system-config/user-settings/user-setting-local.vue";
import EosS3Management from "./components/s3/s3.vue";
import EosAdminUser from "./components/preboarding/admin-user.vue";
import EosWelcome from "./components/preboarding/welcome.vue";
import EosLogin from "./components/preboarding/login.vue";
import UDXRegistration from "./components/udx/udx-registration.vue";
import EosAutoLogin from "./components/preboarding/auto-login.vue";
import EosHomebase from "./components/onboarding/homebase.vue";
import EosOnboarding from "./components/onboarding/system-config/onboarding.vue";
import EosDefault from "./components/eos-default.vue";
import EosPreboarding from "./components/preboarding/eos-preboarding.vue";
import EosProvisioning from "./components/provisioning/eos-provisioning.vue";
import EosProvisioningMenu from "./components/provisioning/eos-provisioning-menu.vue";
import EosSettings from "./components/settings/eos-settings.vue";
import EosSettingsMenu from "./components/settings/eos-settings-menu.vue";

Vue.use(Router);

// Note: requiresAuth: Flag for User Logged into the system
//       isOnboardingReq: Flag for on-boarding complete
const router = new Router({
  routes: [
    {
      path: "/preboarding",
      name: "preboarding",
      component: EosPreboarding,
      meta: { requiresAuth: false, isOnboardingReq: false },
      children: [
        {
          path: "welcome",
          name: "welcome",
          component: EosWelcome,
          meta: { requiresAuth: false, isOnboardingReq: false }
        },
        {
          path: "adminuser",
          name: "adminuser",
          component: EosAdminUser,
          meta: { requiresAuth: false, isOnboardingReq: false }
        },
        {
          path: "login",
          name: "preboarding-login",
          component: EosLogin,
          meta: { requiresAuth: false, isOnboardingReq: false }
        }
      ]
    },
    {
      path: "/login",
      name: "normal-login",
      component: EosLogin,
      meta: { requiresAuth: false, isOnboardingReq: false }
    },
    {
      path: "/",
      component: EosDefault,
      meta: { requiresAuth: true, isOnboardingReq: false },
      children: [
        {
          path: "",
          redirect: "dashboard"
        },
        {
          path: "dashboard",
          name: "dashboard",
          component: Dashboard,
          meta: { requiresAuth: true, isOnboardingReq: false }
        },
        {
          path: "alertlarge",
          name: "eosAlertLarge",
          component: EosAlertLarge,
          meta: { requiresAuth: true, isOnboardingReq: true }
        },
        {
          path: "provisioning",
          component: EosProvisioning,
          meta: { requiresAuth: true, isOnboardingReq: false },
          children: [
            {
              path: "",
              name: "provisioning-menu",
              component: EosProvisioningMenu,
              meta: { requiresAuth: true, isOnboardingReq: false }
            },
            {
              path: "s3",
              name: "s3",
              component: EosS3Management,
              meta: { requiresAuth: true, isOnboardingReq: false }
            }
          ]
        },
        {
          path: "settings",
          component: EosSettings,
          meta: { requiresAuth: true, isOnboardingReq: false },
          children: [
            {
              path: "",
              name: "settings-menu",
              component: EosSettingsMenu,
              meta: { requiresAuth: true, isOnboardingReq: false }
            },
            {
              path: "usersettinglocal",
              name: "usersettinglocal",
              component: EosUserSettingLocal,
              meta: { requiresAuth: true, isOnboardingReq: false }
            },
            {
              path: "udx-registration",
              name: "udx-registration",
              component: UDXRegistration,
              meta: { requiresAuth: true, isOnboardingReq: false }
            }
          ]
        },
        {
          path: "/homebase",
          name: "homebase",
          component: EosHomebase,
          meta: { requiresAuth: true, isOnboardingReq: false }
        },
        {
          path: "/onboarding",
          name: "onboarding",
          component: EosOnboarding,
          meta: { requiresAuth: true, isOnboardingReq: false }
        }
      ]
    },
    {
      path: "clouduser",
      name: "clouduser",
      component: EosAutoLogin,
      meta: { requiresAuth: false, isOnboardingReq: false }
    }
  ]
});

// This code executes before any route happens
router.beforeEach(async (to, from, next) => {
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
