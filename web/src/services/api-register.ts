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
    all_system_config: `/api/${version}/sysconfig`,
    stats: `/api/${version}/stats`,
    csm_user: `/api/${version}/user`, 
    admin_user: `/api/${version}/login`,
    admin_user_create: `/api/${version}/preboarding/user`,
    admin_user_logout: `/api/${version}/logout`,
    udx_reg_status: `/usl/v1/system/certificates/domainCertificate`,
	udx_reg_token: `/usl/v1/registrationToken`,
	udx_devices: `/usl/v1/devices`,
    s3_accounts: `/api/${version}/s3_accounts`,
    s3_iam_users: `/api/${version}/iam_users`,
    s3_bucket: `/api/${version}/s3/bucket`,
    capacity: `/api/${version}/capacity`
};
