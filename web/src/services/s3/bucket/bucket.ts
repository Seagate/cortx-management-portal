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
import { Api } from "../../api";
import apiRegister from "../../api-register";
import { Request, Response, request, response } from "express";

/**
 * This is responsible for getting S3 bucket data
 * @param query 
 */
export const getBuckets = async (req: Request, res: Response) => {
    let bucketData = Api.getAll(apiRegister.get_s3_bucket(req.params.version), req, res);
    let result = await bucketData;
    return result;
};

/**
 * This is responsible to create S3 bucket
 * @param req 
 * @param res 
 */
export const createBucket = async (req: Request, res: Response) => {
    let bucketData = Api.post(apiRegister.get_s3_bucket(req.params.version), req, res);
    let result = await bucketData;
    return result;
};

/**
 * This method deletes the S3 bucket.
 * @param req 
 * @param res 
 */
export const deleteBucket = async (req: Request, res: Response) => {
    let bucket = Api.delete(apiRegister.get_s3_bucket(req.params.version), req, res, req.params.bucket_name);
    return bucket;
};
/**
 * 
 * @param req Update bucket policy
 * @param res 
 */
export const updateBuketPolicy = async (req: Request, res: Response) => {
    let updatePolicy = Api.put(apiRegister.get_bucket_policy(req.params.version), req, res, req.params.bucket_name);
    let result = await updatePolicy;
    return result;
};
/**
 * 
 * @param req delete bucket policy
 * @param res 
 */
export const deleteBucketPolicy = async (req: Request, res: Response) => {
    let deletePolicy = Api.delete(apiRegister.get_bucket_policy(req.params.version), req, res, req.params.bucket_name);
    return deletePolicy;
};
/**
 * 
 * @param req get bucket policy
 * @param res 
 */
export const getBucketsPolicy = async (req: Request, res: Response) => {
    let getbucket = Api.get(apiRegister.get_bucket_policy(req.params.version), req, res, req.params.bucket_name);
    let result = await getbucket;
    return result;
};
