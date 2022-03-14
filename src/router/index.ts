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
<<<<<<< HEAD
import LrHealth from "../components/health/LrHealth.vue";
=======
import LrAlert from "../components/alerts/LrAlert.vue";
import LrAlertDetails from "../components/alerts/LrAlertDetails.vue"
>>>>>>> 9176529e4ba6d4e698a10714dfa60ec2789e1eac

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
<<<<<<< HEAD
    path: "/health",
    name: "Health",
    component: LrHealth,
=======
    path: "/alerts",
    name: "alerts",
    component: LrAlert,
    props:true
  },
  {
    path: "/alert-details/:alertId",
    name: "alert-details",
    component: LrAlertDetails,
    props:true
>>>>>>> 9176529e4ba6d4e698a10714dfa60ec2789e1eac
  },
];

const router = new VueRouter({
  routes,
});

export default router;
