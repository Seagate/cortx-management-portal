export interface Ldap {
    user_search_base: string;
    server: string;
    port: number;
    alt_server: string;
    alt_port: number;
}

export interface Email {
    stmp_server: string;
    smtp_port: string;
    smtp_protocol: string;
    smtp_sender_email: string;
    smtp_sender_password: string;
    email: string;
    weekly_email: boolean;
    send_test_mail: boolean;
}

export interface Syslog {
    syslog_server: string;
    syslog_port: number;
    send_test_syslog: boolean;
}

export interface Notifications {
    email: Email;
    syslog: Syslog;
}

export interface UserConfigObject {
    user_config_id: string;
    ldap: Ldap;
    notifications: Notifications;
}


