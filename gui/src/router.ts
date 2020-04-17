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
import EosAlertHistory from "./components/alerts/alert-history-details.vue";
import EosAlertDetails from "./components/alerts/alert-details.vue";
import EosUserSettingLocal from "./components/onboarding/system-config/user-settings/user-setting-local.vue";
import EosS3Management from "./components/s3/s3.vue";
import EosAdminUser from "./components/preboarding/admin-user.vue";
import EosWelcome from "./components/preboarding/welcome.vue";
import EosLogin from "./components/preboarding/login.vue";
import EosUDX from "./components/udx/eos-udx.vue";
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
import EosNotifications from "./components/settings/notifications-email-setting.vue";
import EosSoftware from "./components/maintenance/eos-software.vue";
import EosMangementSetting from "./components/settings/mgmt-network-setting.vue";
import EosDataNetworkSetting from "./components/settings/data-network-setting.vue";
import EosDnsDataSetting from "./components/settings/dns-data-setting.vue";
import EOSUploadSSLSetting from "./components/settings/ssl-certificate-setting.vue";
import EosNtpSetting from "./components/settings/ntp-setting.vue";
import EosAbout from "./components/maintenance/eos-about.vue";
import EosHealthSubmenu from "./components/health/eos-health-menu.vue";
import EosHealthView from "./components/health/eos-health-view.vue";
import EosHealthAlertDetails from "./components/health/eos-health-alert-details.vue";
import EosHealth from "./components/health/eos-health.vue";
import store from "./store/store";

Vue.use(Router);

// Note: requiresAuth: Flag for User Logged into the system
const router = new Router({
  routes: [
    {
      path: "/preboarding",
      name: "preboarding",
      component: EosPreboarding,
      meta: { requiresAuth: false },
      children: [
        {
          path: "welcome",
          name: "welcome",
          component: EosWelcome,
          meta: { requiresAuth: false }
        },
        {
          path: "adminuser",
          name: "adminuser",
          component: EosAdminUser,
          meta: { requiresAuth: false }
        },
        {
          path: "login",
          name: "preboarding-login",
          component: EosLogin,
          meta: { requiresAuth: false }
        }
      ]
    },
    {
      path: "/login",
      name: "normal-login",
      component: EosLogin,
      meta: { requiresAuth: false }
    },
    {
      path: "/",
      component: EosDefault,
      meta: { requiresAuth: true },
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
            requiredAccess: userPermissions.alerts + userPermissions.list
          }
        },
        {
          path: "alerts",
          name: "alerts-large",
          component: EosAlertLarge,
          meta: {
            requiresAuth: true,
            requiredAccess: userPermissions.alerts + userPermissions.list
          }
        },
        {
          path: "performance",
          name: "performance-large",
          component: EosPerformanceLarge,
          meta: {
            requiresAuth: true,
            requiredAccess: userPermissions.alerts + userPermissions.list
          }
        },
        {
          path: "alerts/:alert_id",
          name: "alert-detail",
          component: EosAlertDetails,
          meta: {
            requiresAuth: true,
            requiredAccess: userPermissions.alerts + userPermissions.list
          }
        },
        {
          path: "alerts_history/:alert_id",
          name: "alert-history",
          component: EosAlertHistory,
          meta: {
            requiresAuth: true,
            requiredAccess: userPermissions.alerts + userPermissions.list
          }
        },
        {
          path: "provisioning",
          component: EosProvisioning,
          meta: { requiresAuth: true },
          children: [
            {
              path: "",
              name: "provisioning-menu",
              component: EosProvisioningMenu,
              meta: { requiresAuth: true }
            },
            {
              path: "s3",
              name: "s3",
              component: EosS3Management,
              meta: {
                requiresAuth: true,
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
                requiredAccess: userPermissions.users + userPermissions.list
              }
            }
          ]
        },
        {
          path: "health",
          component: EosHealth,
          meta: { requiresAuth: true },
          children: [
            {
              path: "",
              name: "health",
              component: EosHealthSubmenu,
              meta: { requiresAuth: true }
            },
            {
              path: "healthview",
              name: "healthview",
              component: EosHealthView,
              meta: { requiresAuth: true }
            },
            {
              path: "healthview/:alert_id",
              name: "health-alerts-details",
              component: EosHealthAlertDetails,
              meta: { requiresAuth: true }
            }
          ]
        },
        {
          path: "settings",
          component: EosSettings,
          meta: {
            requiresAuth: true,
            requiredAccess: userPermissions.maintenance + userPermissions.list
          },
          children: [
            {
              path: "",
              name: "settings-menu",
              component: EosSettingsMenu,
              meta: {
                requiresAuth: true,
                requiredAccess:
                  userPermissions.maintenance + userPermissions.list
              }
            },
            {
              path: "notifications",
              name: "notifications",
              component: EosNotifications,
              meta: {
                requiresAuth: true,
                requiredAccess:
                  userPermissions.maintenance + userPermissions.list
              }
            },
            {
              path: "management-network",
              name: "management-network",
              component: EosMangementSetting,
              meta: {
                requiresAuth: true,
                requiredAccess:
                  userPermissions.maintenance + userPermissions.list
              }
            },
            {
              path: "data-network",
              name: "data-network",
              component: EosDataNetworkSetting,
              meta: {
                requiresAuth: true,
                requiredAccess:
                  userPermissions.maintenance + userPermissions.list
              }
            },
            {
              path: "dns",
              name: "dns",
              component: EosDnsDataSetting,
              meta: {
                requiresAuth: true,
                requiredAccess:
                  userPermissions.maintenance + userPermissions.list
              }
            },
            {
              path: "ntp",
              name: "ntp",
              component: EosNtpSetting,
              meta: {
                requiresAuth: true,
                requiredAccess:
                  userPermissions.maintenance + userPermissions.list
              }
            },
            {
              path: "ssl-upload",
              name: "ssl-upload",
              component: EOSUploadSSLSetting,
              meta: {
                requiresAuth: true,
                requiredAccess:
                  userPermissions.maintenance + userPermissions.list
              }
            }
          ]
        },
        {
          path: "udx",
          name: "udx",
          component: EosUDX,
          meta: {
            requiresAuth: true,
            requiredAccess: userPermissions.maintenance + userPermissions.list
          }
        },
        {
          path: "maintenance",
          component: EosMaintenance,
          meta: {
            requiresAuth: true,
            requiredAccess: userPermissions.sysconfig + userPermissions.list
          },
          children: [
            {
              path: "",
              name: "maintenance-menu",
              component: EosMaintenanceMenu,
              meta: { requiresAuth: true }
            },
            {
              path: "auditlog",
              name: "auditlog",
              component: EosAuditLog,
              meta: {
                requiresAuth: true,
                requiredAccess: userPermissions.auditlog + userPermissions.list
              }
            },
            {
              path: "resource",
              name: "resource",
              component: EosResource,
              meta: {
                requiresAuth: true,
                requiredAccess:
                  userPermissions.maintenance + userPermissions.list
              }
            },
            {
              path: "firmware",
              name: "firmware",
              component: EosFirmware,
              meta: {
                requiresAuth: true,
                requiredAccess:
                  userPermissions.maintenance + userPermissions.list
              }
            },
            {
              path: "software",
              name: "software",
              component: EosSoftware,
              meta: {
                requiresAuth: true,
                requiredAccess:
                  userPermissions.maintenance + userPermissions.list
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
            requiredAccess: userPermissions.sysconfig + userPermissions.list
          }
        },
        {
          path: "/onboarding",
          name: "onboarding",
          component: EosOnboarding,
          meta: {
            requiresAuth: true,
            requiredAccess: userPermissions.maintenance + userPermissions.list
          }
        },
        {
          path: "403",
          name: "403",
          component: EosUnauthorizedAccess,
          meta: { requiresAuth: true }
        },
        {
          path: "about",
          name: "about",
          component: EosAbout,
          meta: {
            requiresAuth: true,
            requiredAccess: userPermissions.sysconfig + userPermissions.list
          }
        }
      ]
    },
    { path: "*", component: EosNotFound }
  ]
});

// This code executes before any route happens
router.beforeEach(async (to, from, next) => {
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
          !routerApp.$hasAccessToCsm(to.meta.requiredAccess)
        ) {
          // Redirect to Access Denied page
          next({
            path: "/403"
          });
        } else {
          next();
        }
      } catch (error) {
        next({
          path: "/login"
        });
      }
    }
  } else {
    next(); // make sure to always call next()!
  }
});

export default router;
