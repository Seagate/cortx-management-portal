/*****************************************************************************
 Filename:          routes.ts
 Description:       REST APIs to get and save User Config Details

 Creation Date:     12/12/2019
 Author:            Soniya Moholkar

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/

import { Request, Response, request, response } from "express";
import { getUserConfig, saveUserConfig, updateUserConfig } from "./user-config-controller";
import { checkRequiredParams } from './../../../middleware/validator';
import HttpStatus from 'http-status-codes';

/**
 * It has all the REST APIs to get, save, update the System Configuration related details. 
 */

export default [
  {
    path: "/api/v1/userconfig",
    method: "get",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await getUserConfig(req, res);
          res.status(HttpStatus.OK).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  },
  {
    path: "/api/v1/userconfig",
    method: "post",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await saveUserConfig(req, res);
          res.status(HttpStatus.OK).send(result);
        } catch (err) {
          throw err;
        }        
      }
    ]
  },
  {
    path: "/api/v1/userconfig/:user_config_id",
    method: "put",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await updateUserConfig(req, res);
          res.status(HttpStatus.OK).send(result);
        } catch (err) {
          throw err;
        }        
      }
    ]
  }
];