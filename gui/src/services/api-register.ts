/*****************************************************************************
 Filename:          api-register.ts
 Description:       API Register: use for maintainging single registry for API

 Creation Date:     05/09/2019
 Author:            Sanjeevan Bhave

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
    systemconfig: `api/${version}/systemconfig`,
    create_user: `api/${version}/preboarding/user`,
    login: `api/${version}/login`,
    logout: `/api/${version}/logout`,
    udx_reg_token: `api/${version}/udx-device/registration-token`,
    udx_device: `api/${version}/udx-device`,
    s3_account: `/api/${version}/s3_account`,
    s3_iam_user: `/api/${version}/s3_iam_user`,
    stats: `api/${version}/stats/throughput`,
    throughput: `api/${version}/stats/throughput`,
    latency: `api/${version}/stats/latency`,
    iops: `api/${version}/stats/iops`,
    capacity: `api/${version}/capacity`
};
