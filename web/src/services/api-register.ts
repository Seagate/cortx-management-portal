/*****************************************************************************
 Filename:          api-register.ts
 Description:       API Register: use for maintainging single registry for API

 Creation Date:     24/09/2019
 Author:            Soniya Moholkar

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
export const version = "v1";

export default {
  all_alerts: `/api/${version}/alerts`,
  alerts_history: `/api/${version}/alerts_history`,
  all_system_config: `/api/${version}/sysconfig`,
  stats: `/api/${version}/stats`,
  csm_user: `/api/${version}/csm/users`,
  admin_user: `/api/${version}/login`,
  admin_user_create: `/api/${version}/preboarding/user`,
  admin_user_logout: `/api/${version}/logout`,
  udx_register_device: `/usl/v1/registerDevice`,
  udx_registration_token: `/usl/v1/registrationToken`,
  udx_devices: `/usl/v1/devices`,
  s3_accounts: `/api/${version}/s3_accounts`,
  iam_users: `/api/${version}/iam_users`,
  s3_bucket: `/api/${version}/s3/bucket`,
  capacity: `/api/${version}/capacity`,
  bucket_policy: `/api/${version}/s3/bucket_policy`,
  user_permissions: `/api/${version}/permissions`,
  addlicensekey: `/api/${version}/license/onboarding`,
  all_alerts_history: `/api/${version}/alerts_history`,
  auditlogs: `/api/${version}/auditlogs`,
  maintenance: `/api/${version}/maintenance/cluster`,
  node_status: `/api/${version}/maintenance/cluster/node_status`,
  node_stop: `/api/${version}/maintenance/cluster/stop`,
  node_start: `/api/${version}/maintenance/cluster/start`,
  node_shutdown: `/api/${version}/maintenance/cluster/shutdown`,
  health_summary: `/api/${version}/system/health/summary`,
  health_view: `/api/${version}/system/health/view`,
  node_health: `/api/${version}/system/health/node`,
  send_test_email: `/api/${version}/sysconfig_helpers/email_test`,
  hotfix_status: `/api/${version}/upgrade/hotfix/status`,
  hotfix_upload: `/api/${version}/upgrade/hotfix/upload`,
  hotfix_start: `/api/${version}/upgrade/hotfix/start`,
  upload_firmware: `/api/${version}/upgrade/firmware/upload`,
  start_firmware_upgrade: `/api/${version}/upgrade/firmware/start`,
  firmware_package_availability: `/api/${version}/upgrade/firmware/availability`,
  last_upgrade_status: `/api/${version}/upgrade/firmware/status`,
  ssl_upload: `/api/${version}/tls/bundle/upload`,
  ssl_install: `/api/${version}/tls/bundle/install`,
  ssl_status: `/api/${version}/tls/bundle/status`,
};
