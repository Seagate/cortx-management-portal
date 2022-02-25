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

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
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
];

const router = new VueRouter({
  routes,
});

export default router;
