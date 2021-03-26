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

export default {
  get_all_alerts: (version :string) => `/api/${version}/alerts`,
  get_alerts_history:(version :string) => `/api/${version}/alerts_history`,
  get_all_system_config: (version :string) => `/api/${version}/sysconfig`,
  get_stats: (version :string) => `/api/${version}/stats`,
  get_csm_user: (version :string) => `/api/${version}/csm/users`,
  get_admin_user: (version :string) => `/api/${version}/login`,
  get_admin_user_create: (version :string) => `/api/${version}/preboarding/user`,
  get_admin_user_logout: (version :string) => `/api/${version}/logout`,
  get_udx_register_device: (version :string) => `/usl/${version}/registerDevice`,
  get_udx_registration_token: (version :string) => `/usl/${version}/registrationToken`,
  get_udx_devices: (version :string) => `/usl/${version}/devices`,
  get_s3_accounts: (version :string) => `/api/${version}/s3_accounts`,
  get_iam_users: (version :string) => `/api/${version}/iam_users`,
  get_s3_bucket: (version :string) => `/api/${version}/s3/bucket`,
  get_s3_access_keys: (version :string) => `/api/${version}/s3/access_keys`,
  get_capacity: (version :string) => `/api/${version}/capacity`,
  get_bucket_policy: (version :string) => `/api/${version}/s3/bucket_policy`,
  get_user_permissions: (version :string) => `/api/${version}/permissions`,
  get_addlicensekey: (version :string) => `/api/${version}/license/onboarding`,
  get_all_alerts_history: (version :string) => `/api/${version}/alerts_history`,
  get_auditlogs: (version :string) => `/api/${version}/auditlogs`,
  get_maintenance: (version :string) => `/api/${version}/maintenance/cluster`,
  get_node_status: (version :string) => `/api/${version}/maintenance/cluster/node_status`,
  get_node_stop: (version :string) => `/api/${version}/maintenance/cluster/stop`,
  get_node_start: (version :string) => `/api/${version}/maintenance/cluster/start`,
  get_node_shutdown: (version :string) => `/api/${version}/maintenance/cluster/shutdown`,
  get_node_replace: (version :string) => `/api/${version}/maintenance/cluster/replace_node`,
  get_node_replace_status: (version :string) => `/api/${version}/maintenance/cluster/replace_node_status`,
  get_health_summary: (version :string) => `/api/${version}/system/health/summary`,
  get_health_view: (version :string) => `/api/${version}/system/health/view`,
  get_node_health: (version :string) => `/api/${version}/system/health/node`,
  get_send_test_email: (version :string) => `/api/${version}/sysconfig_helpers/email_test`,
  get_hotfix_status: (version :string) => `/api/${version}/update/hotfix/status`,
  get_hotfix_upload: (version :string) => `/api/${version}/update/hotfix/upload`,
  get_hotfix_start: (version :string) => `/api/${version}/update/hotfix/start`,
  get_upload_firmware: (version :string) => `/api/${version}/update/firmware/upload`,
  get_start_firmware_upgrade: (version :string) => `/api/${version}/update/firmware/start`,
  get_firmware_package_availability: (version :string) => `/api/${version}/update/firmware/availability`,
  get_last_upgrade_status: (version :string) => `/api/${version}/update/firmware/status`,
  get_ssl_upload: (version :string) => `/api/${version}/tls/bundle/upload`,
  get_ssl_install: (version :string) => `/api/${version}/tls/bundle/install`,
  get_ssl_status: (version :string) => `/api/${version}/tls/bundle/status`,
  get_ssl_details: (version :string) => `/api/${version}/tls/bundle/details`,
  get_product_version: (version :string) => `/api/${version}/product_version`,
  get_health_components: (version :string) => `/api/${version}/system/health/components`,
  get_health_resources: (version :string) => `/api/${version}/system/health/resources`,
  get_system_status: (version :string) => `/api/${version}/system/status`,
  get_appliance_info: (version :string) => `/api/${version}/appliance_info`
};
