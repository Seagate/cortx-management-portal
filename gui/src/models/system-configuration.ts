/*****************************************************************************
 Filename:          system-configuration.vue
 Description:       System Configuration Model

 Creation Date:     30/08/2019
 Author:            Sanjeevan Bhave

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/

// Interface for CSM schema for System Configuration

// onboarding scheama

export interface Ipv4 {
  is_dhcp: boolean;
  vip_address?: string;
  netmask: string;
  gateway: string;
  vip_hostname?: string;
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
  ip_address: string;
  hostname: string;
}

export interface DataNetworkIpv4 {
  is_dhcp: boolean;
  vip_address?: string;
  vip_hostname?: string;
  netmask: string;
  gateway: string;
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
  is_external_load_balancer: boolean;
  ipv4: DataNetworkIpv4;
  ipv6: DataNetworkIpv6;
}

export interface DnsNetworkSettingsNode {
  id: number;
  name:string;
  hostname: string;
  dns_servers: string[];
  search_domain: string[];
}

export interface DnsNetworkSettings {
  // hostname: string;
  // dns_servers: string[];
  // search_domain: string[];
  nodes: DnsNetworkSettingsNode[];
}

export interface Ntp {
  ntp_server_address: string;
  ntp_timezone_offset: string;
}

export interface DateTime {
  date: string;
  hour: string;
  minute: string;
  clock: string;
}

export interface DateTimeSettings {
  is_ntp: boolean;
  ntp: Ntp;
  date_time: DateTime;
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
