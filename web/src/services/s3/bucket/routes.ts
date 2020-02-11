/*****************************************************************************
 Filename:          routes.ts
 Description:       REST APIs to get, save, update S3 Bucket.

 Creation Date:     11/25/2019
 Author:            Soniya Moholkar

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/

import { Request, Response, request, response } from "express";
import { getBuckets, createBucket, deleteBucket, updateBuketPolicy, getBucketsPolicy,deleteBucketPolicy } from "./bucket";
import { checkRequiredParams } from './../../../middleware/validator';
import HttpStatus from 'http-status-codes';

/**
 * It has all the REST APIs to get, save, update the System Configuration related details. 
 */

export default [
  {
    path: "/api/v1/s3/bucket",
    method: "get",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await getBuckets(req, res);
          res.status(HttpStatus.OK).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  },
  {
    path: "/api/v1/s3/bucket",
    method: "post",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await createBucket(req, res);
          res.status(HttpStatus.OK).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  },
  {
    path: "/api/v1/s3/bucket/:bucket_name",
    method: "delete",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        const result = await deleteBucket(req, res);
        res.status(HttpStatus.OK).send(result);
      }
    ]
  },
  {
    path: "/api/v1/s3/bucket_policy/:bucket_name",
    method: "put",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await updateBuketPolicy(req, res);
          res.status(HttpStatus.OK).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  },
   {
    path: "/api/v1/s3/bucket_policy/:bucket_name",
    method: "delete",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        const result = await deleteBucketPolicy(req, res);
        res.status(HttpStatus.OK).send(result);
      }
    ]
  },
  {
    path: "/api/v1/s3/bucket_policy/:bucket_name",
    method: "get",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await getBucketsPolicy(req, res);
          res.status(HttpStatus.OK).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  },
];