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
// export interface Ipv4 {
//     isManual: boolean;
//     ipAddress: string;
//     netmask: string;
//     gateway: string;
// }

// export interface StaticAddr {
//     ip_address: string;
// }

// export interface Ipv6 {
//     isManual: boolean;
//     gateway: string;
//     static_addr: StaticAddr[];
// }

// export interface DataNetworkSetting {
//     isExternalLoadBalancer: boolean;
//     networkPreference: string[];
// }

// export interface SystemConfig {
//     ipv4: Ipv4;
//     ipv6: Ipv6;
//     data_network_setting: DataNetworkSetting;
// }

// export default interface SystemConfigObject {
//     system_config: SystemConfig;
// }
//onboarding scheama

export interface Ipv4 {
    is_dhcp: boolean;
    ip_address: string;
    netmask: string;
    gateway: string;
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

export interface Ipv4Node {
    ip_address: string;
    netmask: string;
    gateway: string;
}

export interface DataNetworkIpv4 {
    is_dhcp: boolean;
    node0: Ipv4Node;
    node1: Ipv4Node;
}

export interface DataNetworkIpv6Node {
    ip_address: string[];
    gateway: string;
    address_label: string;
    type: string;
}

export interface DataNetworkIpv6 {
    is_auto: boolean;
    node0: DataNetworkIpv6Node;
    node1: DataNetworkIpv6Node;
}

export interface DataNetworkSettings {
    is_external_load_balancer: boolean;
    ipv4: DataNetworkIpv4;
    ipv6: DataNetworkIpv6;
}

export interface DnsNetworkSettingsNode {
    dns_servers: string[];
    search_domain: string[];
}

export interface DnsNetworkSettings {
    is_external_load_balancer: boolean;
    fqdn_name: string;
    hostname: string;
    node0: DnsNetworkSettingsNode;
    node1: DnsNetworkSettingsNode;
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
    ntp: Ntp;
    date_time: DateTime;
}

export interface SystemConfigObject {
    management_network_settings: ManagementNetworkSettings;
    data_network_settings: DataNetworkSettings;
    dns_network_settings: DnsNetworkSettings;
    date_time_settings: DateTimeSettings;
}



