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
export const version = "v2";

export default {
  all_alerts: `/api/${version}/alerts`,
  alerts_history: `/api/${version}/alerts_history`,
  systemconfig: `api/${version}/systemconfig`,
  login: `api/${version}/login`,
  csm_user: `api/${version}/csm/users`,
  logout: `/api/${version}/logout`,
  udx_registration: `api/${version}/udx_device/registration`,
  udx_registration_token: `api/${version}/udx_device/registration_token`,
  udx_device: `api/${version}/udx_device`,
  s3_url: `/api/${version}/s3`,
  s3_account: `/api/${version}/s3_accounts`,
  s3_iam_user: `/api/${version}/iam_users`,
  s3_bucket: `/api/${version}/s3/bucket`,
  s3_access_keys: `/api/${version}/s3/access_keys`,
  stats: `api/${version}/stats`,
  throughput: `api/${version}/stats/throughput`,
  latency: `api/${version}/stats/latency`,
  iops: `api/${version}/stats/iops`,
  capacity: `api/${version}/capacity`,
  sysconfig: `api/${version}/sysconfig`,
  bucket_policy: `/api/${version}/s3/bucket_policy`,
  user_permissions: `/api/${version}/permissions`,
  unsupported_features: `/api/${version}/unsupported_features`,
  addlicensekey: `/api/${version}/license/onboarding`,
  hotfix_status: `/api/${version}/update/hotfix/status`,
  hotfix_upload: `/api/${version}/update/hotfix/upload`,
  hotfix_start: `/api/${version}/update/hotfix/start`,
  upload_firmware: `/api/${version}/update/firmware/upload`, // TODO: change to right API
  auditlogs: `/api/${version}/auditlogs`,
  maintenance: `/api/${version}/maintenance/cluster`,
  node_status: `/api/${version}/maintenance/cluster/node_status`,
  node_stop: `/api/${version}/maintenance/cluster/stop`,
  node_start: `/api/${version}/maintenance/cluster/start`,
  node_shutdown: `/api/${version}/maintenance/cluster/shutdown`,
  node_replace: `/api/${version}/maintenance/cluster/replace_node`,
  node_replace_status: `/api/${version}/maintenance/cluster/replace_node_status`,
  health_summary: `/api/${version}/system/health/summary`,
  audit_alerts: `/api/${version}/audit_alerts`,
  send_test_email: `/api/${version}/sysconfig_helpers/email_test`,
  ssl_upload: `/api/${version}/tls/bundle/upload`,
  ssl_install: `/api/${version}/tls/bundle/install`,
  ssl_status: `/api/${version}/tls/bundle/status`,
  start_firmware_upgrade: `/api/${version}/update/firmware/start`,
  firmware_package_availability: `/api/${version}/update/firmware/availability`,
  last_upgrade_status: `/api/${version}/update/firmware/last_upgrade_status`,
  health_view: `/api/${version}/system/health/view`,
  node_health: `/api/${version}/system/health/node`,
  version: `/api/${version}/product_version`,
  health_components: `api/${version}/system/health/components`,
  system_status: `/api/${version}/system/status`,
  health_resources: `api/${version}/system/health/resources`,
  health_cluster: `api/${version}/system/health/cluster`,
  appliance_info: `/api/${version}/appliance_info`,
  udx_saas: `/api/${version}/udx_saas`,
  ssl_details: `/api/${version}/tls/bundle/details`
};
