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
export const AppConst = {
  navItems: [
    {
      title: "dashboard",
      path: "/dashboard",
      iconDefault: "images/dashboard-grey.svg",
      iconActive: "images/dashboard-white.svg",
      requiredAccess: "alerts",
    },
    {
      title: "health",
      path: "/health",
      iconDefault: "images/health-grey.svg",
      iconActive: "images/health-white.svg",
      requiredAccess: "sysconfig",
    },
    {
      title: "manage",
      path: "/manage",
      iconDefault: "images/manage-grey.svg",
      iconActive: "images/manage-white.svg",
      requiredAccess: "s3accounts",
    },
    // {
    //     title: "lyvePilot",
    //     path: "/ldp",
    //     iconDefault: "images/udx-grey.svg",
    //     iconActive: "images/udx-white.svg",
    //     requiredAccess: "lyve_pilot",
    // },
    // {
    //     title: "settings",
    //     path: "/settings",
    //     iconDefault: "images/settings-grey.svg",
    //     iconActive: "images/settings-white.svg",
    //     requiredAccess: "maintenance",
    // },
    // {
    //     title: "maintenance",
    //     path: "/maintenance",
    //     iconDefault: "images/maintenance-grey.svg",
    //     iconActive: "images/maintenance-white.svg",
    //     requiredAccess: "sysconfig",
    // },
  ],
};
