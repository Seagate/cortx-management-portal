/*****************************************************************************
 Filename:          download.ts
 Description:       Audit Log Model

 Creation Date:     13/02/2020
 Author:            Sanjeevan Bhave

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/

// Interface for Audit Log Query Param
export interface AuditLogQueryParam {
    component: string;
    timerange: string;
    from: string;
    to: string;
}
