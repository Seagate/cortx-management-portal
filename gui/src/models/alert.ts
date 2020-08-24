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
// Interface for CSM schema for Alert
interface OtherDetails {
  dc12v: number;
  dctemp: number;
  vendor: string;
  description: string;
  dc33v: number;
  mfg_vendor_id: string;
  fru_shortname: string;
  serial_number: string;
  mfg_date: string;
  part_number: string;
  model: string;
  revision: string;
  dc5v: number;
  dc12i: number;
  dc5i: number;
}

interface ExtendedInfo {
  resource_type: string;
  position: string;
  durable_id: string;
  other_details: OtherDetails;
}

interface Alert {
  id: number;
  alert_uuid: string;
  status: string;
  type: string;
  enclosure_id: number;
  module_name: string;
  description: string;
  support_message: string;
  health: string;
  health_recommendation: string;
  location: string;
  resolve: number;
  acknowledged: number;
  severity: string;
  state: string;
  extended_info: ExtendedInfo;
}

export interface AlertObject {
  total_records: number;
  alerts: Alert[];
}

export interface AlertQueryParam {
  sortby: string;
  dir: string;
  offset: number;
  limit: number;
  resolved?: boolean;
  acknowledged?: boolean;
  show_all?: boolean;
  show_active?: boolean;
  sensor_info?: string;
}

export interface AlertEventDetail {
  name: string;
  event_reason: string;
  event_recommendation: string[];
  showRecommendation: boolean;
}

export interface AlertExtendedInfo {
  event_time?: string;
  resource_id?: string;
  site_id?: string;
  node_id?: string;
  cluster_id?: string;
  rack_id?: string;
  resource?: string;
}

export interface AlertComment {
  comment_id: string;
  comment_text: string;
  created_time: string;
  created_by: string;
}
