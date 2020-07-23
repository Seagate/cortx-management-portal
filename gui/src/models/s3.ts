/*****************************************************************************
 Filename:          s3.ts
 Description:       S3 Model

 Creation Date:     11/11/2019
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/

// Interface for CSM schema for S3 account
export interface Account {
    account_name: string;
    account_email: string;
    password: string;
    access_key: string;
    secret_key: string;
}

export interface IAMUser {
    user_name: string;
    user_id: string;
    password: string;
    arn: string;
    path: string;
    access_key_id: string;
    secret_key: string;
    require_reset: boolean;
}

export interface Bucket {
    bucket_name: string;
}
