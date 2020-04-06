/*****************************************************************************
 Filename:          routes.ts
 Description:       REST APIs to get alert history details

 Creation Date:     25/02/2020
 Author:            Pawan Kumar Srivastava

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/

import { Request, Response, request, response } from "express";
import { getAlertsHistory, getAlertHistoryById } from "./alerts-history-controller";
import { checkRequiredParams } from './../../middleware/validator';
import HttpStatus from 'http-status-codes';


/**
 * It has all the REST APIs to get the alert history related details. 
 */

export default [
  {
    path: "/api/v1/alerts_history",
    method: "get",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await getAlertsHistory(req, res);
          res.status(res.statusCode).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  },
  {
    path: "/api/v1/alerts_history/:alert_id",
    method: "get",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await getAlertHistoryById(req, res);
          res.status(res.statusCode).send(result);
        } catch (err) {
          throw err;
        }
        
      }
    ]
  }
];
