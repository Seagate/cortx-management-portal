// Interface for CSM schema for Alert
export interface ExtendedInfo {
    fields: string;
}

export interface Alert {
    id: string;
    alert_uuid: string;
    type: string;
    state: string;
    created_time: string;
    updated_time: string;
    resolved: string;
    acknowledged: string;
    severity: string;
    resource_type: string;
    enclosure_id: string;
    module_type: string;
    module_name: string;
    description_id: string;
    description: string;
    health: string;
    health_recomendation_id: string;
    health_recomendation: string;
    extended_info: ExtendedInfo;
}

export default interface AlertObject {
    total_records: number;
    alerts: Alert[];
}
