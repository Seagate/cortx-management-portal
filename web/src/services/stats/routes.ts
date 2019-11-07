/*****************************************************************************
 Filename:          routes.ts
 Description:       REST APIs to get stats data

 Creation Date:     11/06/2019
 Author:            Soniya Moholkar

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/

import { Request, Response, request, response } from "express";
import { getStats } from "./stats"
import { checkRequiredParams } from './../../middleware/validator';
import HttpStatus from 'http-status-codes';

/**
 * It has all the REST APIs to get, save, update the System Configuration related details. 
 */

export default [
  {
    path: "/api/v1/stats/:statsparam?",
    method: "get",
    handler: [
      checkRequiredParams,
      async ({ query, params }: Request, res: Response) => {
        try {
          let pathparam = params.statsparam;
          const result = await getStats(query, pathparam);
          res.status(HttpStatus.OK).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  }  
];