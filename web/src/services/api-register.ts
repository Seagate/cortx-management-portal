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
    all_system_config: `/api/${version}/config`,
    management_network: `/api/${version}/networkmanagement`,
    stats: `/api/${version}/stats`
};
