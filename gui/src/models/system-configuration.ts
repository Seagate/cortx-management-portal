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
export interface Ipv4 {
    isManual: boolean;
    ipAddress: string;
    netmask: string;
    gateway: string;
}

export interface StaticAddr {
    ip_address: string;
}

export interface Ipv6 {
    isManual: boolean;
    gateway: string;
    static_addr: StaticAddr[];
}

export interface DataNetworkSetting {
    isExternalLoadBalancer: boolean;
    networkPreference: string[];
}

export interface SystemConfig {
    ipv4: Ipv4;
    ipv6: Ipv6;
    data_network_setting: DataNetworkSetting;
}

export default interface SystemConfigObject {
    system_config: SystemConfig;
}
