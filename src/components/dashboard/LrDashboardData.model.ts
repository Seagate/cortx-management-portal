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
export interface CapacityData {
  size: number;
  available: number;
  used: number;
  usagePercentage: number;
}

export interface StorageComponentsData {
  buckets: number;
  objects: number;
  underReplicated: number;
}

export interface PerformanceData {
  readThroughput: number;
  writeThroughput: number;
  unit: string;
}

export interface BackgroundActivitiesData {
  tasks: number;
}

export interface AlertData {
  fatal: number;
  critical: number;
  error: number;
  warning: number;
  informational: number;
}

export type ClusterStatusTypes = "degraded" | "failed" | "offline";
export type ClusterDetails = {
  name: string;
  status: ClusterStatusTypes;
};

export interface NodeStatus {
  online: number;
  offline: number;
  failed: number;
  degraded: number;
}
export interface HealthData {
  cluster: ClusterDetails;
  nodes: NodeStatus;
}

export interface DashboardCardDetail {
  title: number | string;
  description: string;
  imgUrl: string;
  navPath: string;
}
