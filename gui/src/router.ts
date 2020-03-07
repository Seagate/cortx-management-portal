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
import Dashboard from "./components/dashboard/dashboard.vue";
import EosAlertLarge from "./components/alerts/alert-large.vue";
import EosAlertDetails from "./components/alerts/alert-details.vue";
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
import EosAuditLog from "./components/maintenance/auditlog.vue";
import EosUnauthorizedAccess from "./components/security/403.vue";
import EosNotFound from "./components/security/404.vue";
import EosPerformanceLarge from "./components/performance/performance-large.vue";
import { userPermissions } from "./common/user-permissions-map";
import EosMaintenance from "./components/maintenance/eos-maintenance.vue";
import EosMaintenanceMenu from "./components/maintenance/eos-maintenance-menu.vue";
import EosResource from "./components/maintenance/eos-resource.vue";
import EosFirmware from "./components/onboarding/system-config/firmware/firmware.vue";
import EosNotifications from "./components/onboarding/system-config/notifications/notifications-email.vue";
import EosManagementNetwork from "./components/onboarding/system-config/mgmt-network/network-settings-ipv4.vue";
import EosDataNetwork from "./components/onboarding/system-config/data-network/data-network-ipv4.vue";
import EosDNS from "./components/onboarding/system-config/dns/dns-setting.vue";
import EosNTP from "./components/onboarding/system-config/date-time/date-time.vue";
import EosSSL from "./components/onboarding/system-config/ssl-certificate/upload-ssl.vue";
import EosAbout from "./components/maintenance/eos-about.vue";
import store from "./store/store";

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
          meta: {
            requiresAuth: true,
            isOnboardingReq: false,
            requiredAccess: userPermissions.alerts + userPermissions.list
          }
        },
        {
          path: "alerts",
          name: "alerts-large",
          component: EosAlertLarge,
          meta: {
            requiresAuth: true,
            isOnboardingReq: true,
            requiredAccess: userPermissions.alerts + userPermissions.list
          }
        },
        {
          path: "performance",
          name: "performance-large",
          component: EosPerformanceLarge,
          meta: {
            requiresAuth: true,
            isOnboardingReq: true,
            requiredAccess: userPermissions.alerts + userPermissions.list
          }
        },
        {
          path: "alerts/:alert_id",
          name: "alert-detail",
          component: EosAlertDetails,
          meta: {
            requiresAuth: true,
            isOnboardingReq: true,
            requiredAccess: userPermissions.alerts + userPermissions.list
          }
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
              meta: {
                requiresAuth: true,
                isOnboardingReq: false,
                requiredAccess:
                  userPermissions.s3accounts + userPermissions.list
              }
            },
            {
              path: "usersettinglocal",
              name: "usersettinglocal",
              component: EosUserSettingLocal,
              meta: {
                requiresAuth: true,
                isOnboardingReq: false,
                requiredAccess: userPermissions.users + userPermissions.list
              }
            }
          ]
        },
        {
          path: "settings",
          component: EosSettings,
          meta: {
            requiresAuth: true,
            isOnboardingReq: false,
            requiredAccess: userPermissions.users + userPermissions.list
          },
          children: [
            {
              path: "",
              name: "settings-menu",
              component: EosSettingsMenu,
              meta: {
                requiresAuth: true,
                isOnboardingReq: false,
                requiredAccess: userPermissions.users + userPermissions.list
              }
            },
            {
              path: "/notifications",
              name: "notifications",
              component: EosNotifications,
              meta: {
                requiresAuth: true,
                isOnboardingReq: false,
                requiredAccess: userPermissions.sysconfig + userPermissions.list
              }
            },
            {
              path: "/management-network",
              name: "management-network",
              component: EosManagementNetwork,
              meta: {
                requiresAuth: true,
                isOnboardingReq: false,
                requiredAccess: userPermissions.sysconfig + userPermissions.list
              }
            },
            {
              path: "/data-network",
              name: "data-network",
              component: EosDataNetwork,
              meta: {
                requiresAuth: true,
                isOnboardingReq: false,
                requiredAccess: userPermissions.sysconfig + userPermissions.list
              }
            },
            {
              path: "/dns",
              name: "dns",
              component: EosDNS,
              meta: {
                requiresAuth: true,
                isOnboardingReq: false,
                requiredAccess: userPermissions.sysconfig + userPermissions.list
              }
            },
            {
              path: "/ntp",
              name: "ntp",
              component: EosNTP,
              meta: {
                requiresAuth: true,
                isOnboardingReq: false,
                requiredAccess: userPermissions.sysconfig + userPermissions.list
              }
            },
            {
              path: "/ssl-upload",
              name: "ssl-upload",
              component: EosSSL,
              meta: {
                requiresAuth: true,
                isOnboardingReq: false,
                requiredAccess: userPermissions.sysconfig + userPermissions.list
              }
            }
          ]
        },
        {
          path: "udx-registration",
          name: "udx-registration",
          component: UDXRegistration,
          meta: {
            requiresAuth: true,
            isOnboardingReq: false,
            requiredAccess: userPermissions.sysconfig + userPermissions.list
          }
        },
        {
          path: "maintenance",
          component: EosMaintenance,
          meta: {
            requiresAuth: true,
            isOnboardingReq: false,
            requiredAccess: userPermissions.users + userPermissions.list
          },
          children: [
            {
              path: "",
              name: "maintenance-menu",
              component: EosMaintenanceMenu,
              meta: { requiresAuth: true, isOnboardingReq: false }
            },
            {
              path: "auditlog",
              name: "auditlog",
              component: EosAuditLog,
              meta: {
                requiresAuth: true,
                isOnboardingReq: false,
                requiredAccess: userPermissions.auditlog + userPermissions.list
              }
            },
            {
              path: "resource",
              name: "resource",
              component: EosResource,
              meta: {
                requiresAuth: true,
                isOnboardingReq: false,
                requiredAccess: userPermissions.sysconfig + userPermissions.list
              }
            },
            {
              path: "firmware",
              name: "firmware",
              component: EosFirmware,
              meta: {
                requiresAuth: true,
                isOnboardingReq: false,
                requiredAccess: userPermissions.sysconfig + userPermissions.list
              }
            }
          ]
        },
        {
          path: "/homebase",
          name: "homebase",
          component: EosHomebase,
          meta: {
            requiresAuth: true,
            isOnboardingReq: false,
            requiredAccess: userPermissions.sysconfig + userPermissions.list
          }
        },
        {
          path: "/onboarding",
          name: "onboarding",
          component: EosOnboarding,
          meta: {
            requiresAuth: true,
            isOnboardingReq: false,
            requiredAccess: userPermissions.sysconfig + userPermissions.list
          }
        },
        {
          path: "403",
          name: "403",
          component: EosUnauthorizedAccess,
          meta: { requiresAuth: false, isOnboardingReq: false }
        },
        {
          path: "about",
          name: "about",
          component: EosAbout,
          meta: {
            requiresAuth: true,
            isOnboardingReq: false,
            requiredAccess: userPermissions.sysconfig + userPermissions.list
          }
        },
        {
          path: "clouduser",
          name: "clouduser",
          component: EosAutoLogin,
          meta: { requiresAuth: false, isOnboardingReq: false }
        }
      ]
    },
    { path: "*", component: EosNotFound }
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
      try {
        await store.dispatch("userLogin/getUserPermissionsAction");
        const routerApp: any = router.app.$root;
        if (
          to.meta.requiredAccess &&
          // tslint:disable-next-line
          !routerApp.$hasAccessToCsm(to.meta.requiredAccess)
        ) {
          next({
            path: "/403"
          });
        }
      } catch (error) {
        // tslint:disable-next-line: no-console
        console.log("getUserPermissionsAction failed", error);
        next({
          path: "/login"
        });
      }
      next();
    }
  } else {
    next(); // make sure to always call next()!
  }
});

export default router;
