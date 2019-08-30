// Interface for CSM schema for Alert
export interface OtherDetails {
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

export interface ExtendedInfo {
    resource_type: string;
    position: string;
    durable_id: string;
    other_details: OtherDetails;
}

export interface Alert {
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
    resolved: number;
    acknowledged: number;
    severity: number;
    state: string;
    extended_info: ExtendedInfo;
}

export default interface AlertObject {
    total_records: number;
    alerts: Alert[];
}
