/*****************************************************************************
 Filename:          alert.vue
 Description:       Alert Model

 Creation Date:     30/08/2019
 Author:            Sanjeevan Bhave

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/

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
    alert_uuid: number;
    status: string;
    type: string;
    enclosure_id: number;
    module_name: string;
    description: string;
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
}
