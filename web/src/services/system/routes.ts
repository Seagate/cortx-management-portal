/*****************************************************************************
 Filename:          routes.ts
 Description:       REST APIs to get system details

 Creation Date:     26/02/2020
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/

import { Request, Response } from "express";
import  SystemController from "./system-controller";
import { checkRequiredParams } from './../../middleware/validator';
import HttpStatus from 'http-status-codes';


/**
 * It has all the REST APIs to get the system related details. 
 */

const syscontroller = new SystemController()
export default [
  {
    path: "/api/v1/system/health",
    method: "get",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await syscontroller.getHealthSummary(req, res);
          res.status(HttpStatus.OK).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  },
  {
    path: "/api/v1/system/health_view",
    method: "get",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await syscontroller.getHealthView(req, res);
          res.status(HttpStatus.OK).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  },
  {
    path: "/api/v1/system/node_health",
    method: "get",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await syscontroller.getNodeHealth(req, res);
          res.status(HttpStatus.OK).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  }
];