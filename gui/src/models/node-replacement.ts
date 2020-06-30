/*****************************************************************************
 Filename:          node-replacement.ts
 Description:       Node replacement Model

 Creation Date:     25/06/2020
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/

export interface LastNodeReplacementStatus {
    node_id: string;
    job_id: string;
    status: string;
    created_time: string;
    updated_time: string;
}
