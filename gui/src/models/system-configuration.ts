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
// Interface for CSM schema for System Configuration

// onboarding schema

export interface Ipv4 {
  is_dhcp: boolean;
  nodes: Ipv4Node;
}

export interface Ipv6 {
  is_dhcp: boolean;
  ip_address: string[];
  gateway: string;
  address_label: string;
  type: string;
}

export interface ManagementNetworkSettings {
  ipv4: Ipv4;
  ipv6: Ipv6;
}

export interface ManagementNetworkIpv4 {
  is_dhcp: boolean;
  nodes: Ipv4Node;
}
export interface Ipv4Node {
  id: number;
  name: string;
  ip_address: string;
  netmask?: string;
  gateway?: string;
}

export interface DataNetworkIpv4 {
  is_dhcp: boolean;
  nodes: Ipv4Node;
}

export interface DataNetworkIpv6Node {
  id: number;
  ip_address: string[];
  gateway: string;
  address_label: string;
  type: string;
}

export interface DataNetworkIpv6 {
  is_auto: boolean;
  nodes: DataNetworkIpv6Node[];
}

export interface DataNetworkSettings {
  ipv4: DataNetworkIpv4;
  ipv6?: DataNetworkIpv6;
}

export interface DnsNetworkSettingsNode {
  id: number;
  name: string;
  dns_servers: string[];
  search_domain: string[];
}

export interface DnsNetworkSettings {
  nodes: DnsNetworkSettingsNode[];
}

export interface Ntp {
  ntp_server_address: string;
  ntp_timezone_offset: string;
}

export interface DateTimeSettings {
  is_ntp: boolean;
  ntp: Ntp;
}
export interface Ldap {
  user_search_base: string;
  server: string;
  port: number;
  alt_server: string;
  alt_port: number;
}

export interface Email {
  smtp_server: string;
  smtp_port: string;
  smtp_protocol: string;
  smtp_sender_email: string;
  smtp_sender_password: string;
  email: string;
}

export interface Syslog {
  syslog_server: string;
  syslog_port: number;
}

export interface Notifications {
  email: Email;
  syslog: Syslog;
}

export interface WizardData {
  current_component: string;
}

export interface SystemConfigObject {
  management_network_settings: ManagementNetworkSettings;
  data_network_settings: DataNetworkSettings;
  dns_network_settings: DnsNetworkSettings;
  date_time_settings: DateTimeSettings;
  config_id: string;
  ldap: Ldap;
  notifications: Notifications;
  wizard_metadata: WizardData;
  is_summary: boolean;
  appliance_name: string;
}

export interface Header {
  state: string;
  name: string;
}

export interface Footer {
  nextComponent: string;
  prevComponent: string;
  nextBtnText: string;
  prevBtnText: string;
  api: string;
}

export interface Step {
  sequence: number;
  isSubstep: boolean;
  component: string;
  path: string;
  isByPassed: boolean;
  hideHeader?: boolean;
  header?: Header;
  footer: Footer;
  name: string;
}

export interface WizardMetadata {
  currentComponent: string;
  steps: Step[];
}
