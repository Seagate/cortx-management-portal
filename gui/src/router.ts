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
import Router from "vue-router";
import Dashboard from "./components/dashboard/dashboard.vue";
import CortxAlertLarge from "./components/alerts/alert-large.vue";
import CortxAlertHistory from "./components/alerts/alert-history-details.vue";
import CortxAlertDetails from "./components/alerts/alert-details.vue";
import CortxUserSettingLocal from "./components/onboarding/system-config/user-settings/user-setting-local.vue";
import CortxS3Management from "./components/s3/s3.vue";
import CortxAdminUser from "./components/preboarding/admin-user.vue";
import CortxWelcome from "./components/preboarding/welcome.vue";
import CortxLicense from "./components/preboarding/license.vue";
import CortxLogin from "./components/preboarding/login.vue";
import CortxUDX from "./components/udx/cortx-udx.vue";
import CortxHomebase from "./components/onboarding/homebase.vue";
import CortxOnboarding from "./components/onboarding/system-config/onboarding.vue";
import CortxDefault from "./components/cortx-default.vue";
import CortxPreboarding from "./components/preboarding/cortx-preboarding.vue";
import CortxProvisioning from "./components/provisioning/cortx-provisioning.vue";
import CortxProvisioningMenu from "./components/provisioning/cortx-provisioning-menu.vue";
import CortxSettings from "./components/settings/cortx-settings.vue";
import CortxSettingsMenu from "./components/settings/cortx-settings-menu.vue";
import CortxAuditLog from "./components/maintenance/cortx-auditlog.vue";
import CortxUnauthorizedAccess from "./components/security/403.vue";
import CortxNotFound from "./components/security/404.vue";
import CortxPerformanceLarge from "./components/performance/performance-large.vue";
import { userPermissions } from "./common/user-permissions-map";
import CortxMaintenance from "./components/maintenance/cortx-maintenance.vue";
import CortxMaintenanceMenu from "./components/maintenance/cortx-maintenance-menu.vue";
import CortxResource from "./components/maintenance/cortx-resource.vue";
import CortxNodeReplacement from "./components/maintenance/cortx-node-replacement.vue";
import CortxFirmware from "./components/onboarding/system-config/firmware/firmware.vue";
import CortxNotifications from "./components/settings/notifications-email-setting.vue";
import CortxSoftware from "./components/maintenance/cortx-software.vue";
import CortxMangementSetting from "./components/settings/mgmt-network-setting.vue";
import CortxDataNetworkSetting from "./components/settings/data-network-setting.vue";
import CortxDnsDataSetting from "./components/settings/dns-data-setting.vue";
import CortxUploadSSLSetting from "./components/settings/ssl-certificate-setting.vue";
import CortxNtpSetting from "./components/settings/ntp-setting.vue";
import CortxAbout from "./components/maintenance/cortx-about.vue";
import CortxHealthSubmenu from "./components/health/cortx-health-menu.vue";
import CortxHealthView from "./components/health/cortx-health-view.vue";
import CortxSeverityBasedHealthView from "./components/health/cortx-severity-based-health-view.vue";
import CortxHealth from "./components/health/cortx-health.vue";
import store from "./store/store";

Vue.use(Router);

// Note: requiresAuth: Flag for User Logged into the system
const router = new Router({
  routes: [
    {
      path: "/preboarding",
      name: "preboarding",
      component: CortxPreboarding,
      meta: { requiresAuth: false },
      children: [
        {
          path: "welcome",
          name: "welcome",
          component: CortxWelcome,
          meta: { requiresAuth: false }
        },
        {
          path: "gdpr",
          name: "gdpr",
          component: CortxLicense,
          meta: { requiresAuth: false }
        },
        {
          path: "login",
          name: "preboarding-login",
          component: CortxLogin,
          meta: { requiresAuth: false }
        }
      ]
    },
    {
      path: "/login",
      name: "normal-login",
      component: CortxLogin,
      meta: { requiresAuth: false }
    },
    {
      path: "/",
      component: CortxDefault,
      meta: { requiresAuth: true },
      children: [
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
          component: CortxAlertLarge,
          meta: {
            requiresAuth: true,
            requiredAccess: userPermissions.alerts + userPermissions.list
          }
        },
        {
          path: "performance",
          name: "performance-large",
          component: CortxPerformanceLarge,
          meta: {
            requiresAuth: true,
            requiredAccess: userPermissions.alerts + userPermissions.list
          }
        },
        {
          path: "alerts/:alert_id",
          name: "alert-detail",
          component: CortxAlertDetails,
          meta: {
            requiresAuth: true,
            requiredAccess: userPermissions.alerts + userPermissions.list
          }
        },
        {
          path: "alerts_history/:alert_id",
          name: "alert-history",
          component: CortxAlertHistory,
          meta: {
            requiresAuth: true,
            requiredAccess: userPermissions.alerts + userPermissions.list
          }
        },
        {
          path: "manage",
          component: CortxProvisioning,
          meta: { requiresAuth: true },
          children: [
            {
              path: "",
              name: "provisioning-menu",
              component: CortxProvisioningMenu,
              meta: { requiresAuth: true,
                requiredAccess:
                  userPermissions.users + userPermissions.list
              }
            },
            {
              path: "s3",
              name: "s3",
              component: CortxS3Management,
              meta: {
                requiresAuth: true,
                requiredAccess:
                  userPermissions.s3accounts + userPermissions.delete
              }
            },
            {
              path: "usersettinglocal",
              name: "usersettinglocal",
              component: CortxUserSettingLocal,
              meta: {
                requiresAuth: true,
                requiredAccess: userPermissions.users + userPermissions.list
              }
            }
          ]
        },
        {
          path: "health",
          component: CortxHealth,
          meta: { requiresAuth: true },
          children: [
            {
              path: "",
              name: "health",
              component: CortxHealthSubmenu,
              meta: {
                requiresAuth: true,
                requiredAccess: userPermissions.users + userPermissions.list
              }
            },
            {
              path: "healthview",
              name: "healthview",
              component: CortxHealthView,
              meta: { requiresAuth: true }
            },
            {
              path: "healthview/severity/:severity",
              name: "health-view-severity-based",
              component: CortxSeverityBasedHealthView,
              meta: { requiresAuth: true }
            }
          ]
        },
        {
          path: "settings",
          component: CortxSettings,
          meta: {
            requiresAuth: true,
            requiredAccess: userPermissions.maintenance + userPermissions.list
          },
          children: [
            {
              path: "",
              name: "settings-menu",
              component: CortxSettingsMenu,
              meta: {
                requiresAuth: true,
                requiredAccess:
                  userPermissions.maintenance + userPermissions.list
              }
            },
            {
              path: "notifications",
              name: "notifications",
              component: CortxNotifications,
              meta: {
                requiresAuth: true,
                requiredAccess:
                  userPermissions.maintenance + userPermissions.list
              }
            },
            {
              path: "management-network",
              name: "management-network",
              component: CortxMangementSetting,
              meta: {
                requiresAuth: true,
                requiredAccess:
                  userPermissions.maintenance + userPermissions.list
              }
            },
            {
              path: "data-network",
              name: "data-network",
              component: CortxDataNetworkSetting,
              meta: {
                requiresAuth: true,
                requiredAccess:
                  userPermissions.maintenance + userPermissions.list
              }
            },
            {
              path: "dns",
              name: "dns",
              component: CortxDnsDataSetting,
              meta: {
                requiresAuth: true,
                requiredAccess:
                  userPermissions.maintenance + userPermissions.list
              }
            },
            {
              path: "ntp",
              name: "ntp",
              component: CortxNtpSetting,
              meta: {
                requiresAuth: true,
                requiredAccess:
                  userPermissions.maintenance + userPermissions.list
              }
            },
            {
              path: "ssl-upload",
              name: "ssl-upload",
              component: CortxUploadSSLSetting,
              meta: {
                requiresAuth: true,
                requiredAccess:
                  userPermissions.maintenance + userPermissions.list
              }
            }
          ]
        },
        {
          path: "ldp",
          name: "ldp",
          component: CortxUDX,
          meta: {
            requiresAuth: true,
            requiredAccess: userPermissions.lyve_pilot + userPermissions.list
          }
        },
        {
          path: "maintenance",
          component: CortxMaintenance,
          meta: {
            requiresAuth: true,
            requiredAccess: userPermissions.sysconfig + userPermissions.list
          },
          children: [
            {
              path: "",
              name: "maintenance-menu",
              component: CortxMaintenanceMenu,
              meta: {
                requiresAuth: true,
                requiredAccess: userPermissions.users + userPermissions.list
              }
            },
            {
              path: "auditlog",
              name: "auditlog",
              component: CortxAuditLog,
              meta: {
                requiresAuth: true,
                requiredAccess: userPermissions.auditlog + userPermissions.list
              }
            },
            {
              path: "resource",
              name: "resource",
              component: CortxResource,
              meta: {
                requiresAuth: true,
                requiredAccess:
                  userPermissions.maintenance + userPermissions.list
              }
            },
            {
              path: "firmware",
              name: "firmware",
              component: CortxFirmware,
              meta: {
                requiresAuth: true,
                requiredAccess:
                  userPermissions.maintenance + userPermissions.list
              }
            },
            {
              path: "software",
              name: "software",
              component: CortxSoftware,
              meta: {
                requiresAuth: true,
                requiredAccess:
                  userPermissions.maintenance + userPermissions.list
              }
            }
            // Commented code for EOS-13871
            // {
            //   path: "node_replacement",
            //   name: "node_replacement",
            //   component: CortxNodeReplacement,
            //   meta: {
            //     requiresAuth: true,
            //     requiredAccess:
            //       userPermissions.replace_node + userPermissions.create
            //   }
            // }
          ]
        },
        {
          path: "/homebase",
          name: "homebase",
          component: CortxHomebase,
          meta: {
            requiresAuth: true,
            requiredAccess: userPermissions.sysconfig + userPermissions.list
          }
        },
        {
          path: "/onboarding",
          name: "onboarding",
          component: CortxOnboarding,
          meta: {
            requiresAuth: true,
            requiredAccess: userPermissions.maintenance + userPermissions.list
          }
        },
        {
          path: "403",
          name: "403",
          component: CortxUnauthorizedAccess,
          meta: { requiresAuth: true }
        },
        {
          path: "about",
          name: "about",
          component: CortxAbout,
          meta: {
            requiresAuth: true,
            requiredAccess: userPermissions.sysconfig + userPermissions.list
          }
        }
      ]
    },
    { path: "*", component: CortxNotFound }
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
        await Promise.all([
          store.dispatch("userLogin/getUserPermissionsAction"),
          store.dispatch("userLogin/getUnsupportedFeaturesAction")
        ])
        const routerApp: any = router.app.$root;
        if (to.path === "/" && token) {

          if (routerApp.$hasAccessToCsm(userPermissions.stats + userPermissions.list)) {
            next({ path: "dashboard" });
          }
          if (!routerApp.$hasAccessToCsm(userPermissions.stats + userPermissions.list) &&
            routerApp.$hasAccessToCsm(userPermissions.s3accounts + userPermissions.update)) {
            next({ path: "/manage/s3" });
          }
        }





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
    if (to.path.includes("preboarding")) {
      await store.dispatch("userLogin/getUnsupportedFeaturesAction")
    }
    next(); // make sure to always call next()!
  }
});

export default router;
