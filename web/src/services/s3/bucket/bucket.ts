/*****************************************************************************
 Filename:          bucket.ts
 Description:       Gets the data from provider and process it and send back
                    to client.

 Creation Date:     11/25/2019
 Author:            Soniya Moholkar

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/

import { Api } from "../../api";
import apiRegister from "../../api-register";
import { Request, Response, request, response } from "express";

/**
 * This is responsible for getting S3 bucket data
 * @param query 
 */
export const getBuckets = async (req: Request, res: Response) => {
    let bucketData = Api.getAll(apiRegister.s3_bucket, req, res);
    let result = await bucketData;
    return result;
};

/**
 * This is responsible to create S3 bucket
 * @param req 
 * @param res 
 */
export const createBucket = async (req: Request, res: Response) => {
    let bucketData = Api.post(apiRegister.s3_bucket, req, res);
    let result = await bucketData;
    return result;
};

/**
 * This method deletes the S3 bucket.
 * @param req 
 * @param res 
 */
export const deleteBucket = async (req: Request, res: Response) => {
    let bucket = Api.delete(apiRegister.s3_bucket, req, res, req.params.bucket_name);
    return bucket;
};
/**
 * 
 * @param req Update bucket policy
 * @param res 
 */
export const updateBuketPolicy = async (req: Request, res: Response) => {
    let updatePolicy = Api.put(apiRegister.bucket_policy, req, res, req.params.bucket_name);
    let result = await updatePolicy;
    return result;
};
/**
 * 
 * @param req get bucket policy
 * @param res 
 */
export const getBucketsPolicy = async (req: Request, res: Response) => {
    let getbucket = Api.get(apiRegister.bucket_policy, req, res, req.params.bucket_name);
    let result = await getbucket;
    return result;
};
