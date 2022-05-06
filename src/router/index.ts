/*
 * CORTX-CSM: CORTX Management web.
 * Copyright (c) 2022 Seagate Technology LLC and/or its Affiliates
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
 * please email opensource@seagate.com.
 */
import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import LrDashboard from "../components/dashboard/LrDashboard.vue";
import LrHealth from "../components/health/LrHealth.vue";
import LrAlert from "../components/alerts/LrAlert.vue";
import LrAlertDetails from "../components/alerts/LrAlertDetails.vue";
import LrManageUser from "../components/manage/LrManageUser.vue";
import LrMaintenance from "../components/maintenance/LrMaintenance.vue";
import LrHealthGraphical from "../components/health/LrHealthGraphical.vue";
import LrMaintenanceCards from "../components/maintenance/LrMaintenanceCards.vue";
import LrMaintenanceSupportBundle from "../components/maintenance/LrMaintenanceSupportBundle.vue";
import LrConfiguration from "../components/configuration/LrConfiguration.vue";
import LrConfigurationCards from "../components/configuration/LrConfigurationCards.vue";
import LrObjectStore from "../components/configuration/LrObjectStore.vue";
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    redirect: { name: "Dashboard" },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: LrDashboard,
  },
  {
    path: "/health",
    name: "Health",
    component: LrHealth,
  },
  {
    path: "/alerts",
    name: "alerts",
    component: LrAlert,
    props: true,
  },
  {
    path: "/manage",
    name: "manage",
    component: LrManageUser,
  },
  {
    path: "/alert-details/:alertId",
    name: "alert-details",
    component: LrAlertDetails,
    props: true,
  },
  {
    path: "/maintenance",
    component: LrMaintenance,
    children: [
      {
        path: "",
        name: "maintenance",
        component: LrMaintenanceCards,
      },
      {
        path: "cluster-maintenance",
        name: "cluster_maintenance",
        component: LrHealthGraphical,
      },
      {
        path: "support-bundle",
        name: "support_bundle",
        component: LrMaintenanceSupportBundle,
      },
    ],
  },
  {
    path: "/configuration",
    component: LrConfiguration,
    children: [
      {
        path: "",
        name: "configuration",
        component: LrConfigurationCards,
      },
      {
        path: "object-store",
        name: "object-store",
        component: LrObjectStore,
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
