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
 * along with this program. If not, see https://www.gnu.org/licenses/.
 * For any questions about this software or licensing,
 * please email opensource@seagate.com.
 */
export const dashboardCardData = {
  storageComponents: [
    {
      title: 0,
      description: "buckets",
      imgUrl: "storage-buckets.svg",
      navPath: "",
    },
    {
      title: 0,
      description: "objects",
      imgUrl: "storage-objects.svg",
      navPath: "",
    },
    {
      title: 0,
      description: "underReplicated",
      imgUrl: "storage-under-replicated.svg",
      navPath: "",
    },
  ],
  performance: [
    {
      title: 0,
      description: "readThroughput",
      imgUrl: "performance-read-throughput-good.svg",
      navPath: "/performance",
    },
    {
      title: 0,
      description: "writeThroughput",
      imgUrl: "performance-write-throughput-good.svg",
      navPath: "/performance",
    },
  ],
  clusterNodes: [
    {
      title: 0,
      description: "online",
      imgUrl: "health-zero-nodes.svg",
      navPath: "/health",
    },
    {
      title: 0,
      description: "offline",
      imgUrl: "health-zero-nodes.svg",
      navPath: "/health",
    },
    {
      title: 0,
      description: "failed",
      imgUrl: "health-zero-nodes.svg",
      navPath: "/health",
    },
    {
      title: 0,
      description: "degraded",
      imgUrl: "health-zero-nodes.svg",
      navPath: "/health",
    },
  ],
  alerts: [
    {
      title: 0,
      description: "fatal",
      imgUrl: "alert-fatal.svg",
      navPath: "/alerts",
    },
    {
      title: 0,
      description: "critical",
      imgUrl: "alert-critical.svg",
      navPath: "/alerts",
    },
    {
      title: 0,
      description: "error",
      imgUrl: "alert-error.svg",
      navPath: "/alerts",
    },
    {
      title: 0,
      description: "warning",
      imgUrl: "alert-warning.svg",
      navPath: "/alerts",
    },
    {
      title: 0,
      description: "informational",
      imgUrl: "alert-informational.svg",
      navPath: "/alerts",
    },
  ],
  bgActivities: [
    {
      title: 0,
      description: "tasks",
      imgUrl: "bg-tasks.svg",
      navPath: "",
    },
  ],
};
