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

// Interface for CSM schema for S3 Account
export class Account {
    public account_name: string;
    public account_email: string;
    public password: string;
    public access_key: string;
    public secret_key: string;
}

export class IAMUser {
    public user_name: string;
    public user_id: string;
    public password: string;
    public arn: string;
    public path: string;
    public access_key: string;
    public secret_key: string;
    public require_reset: boolean;
}

export class Bucket {
    public name: string;
}
