/*****************************************************************************
 Filename:          routes.ts
 Description:       REST APIs to get alert details

 Creation Date:     21/08/2019
 Author:            Soniya Moholkar

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/

import { Request, Response, request, response } from "express";
import { getAlerts } from "./alerts-controller";
import { checkRequiredParams } from './../../middleware/validator';


/**
 * It has all the REST APIs to get the alert related details. 
 */

export default [
  {
    path: "/api/v1/alerts",
    method: "get",
    handler: [
      checkRequiredParams,
      async ({ query }: Request, res: Response) => {
        const result = await getAlerts(query.sortby, query.dir, query.offset, query.limit);
        res.status(200).send(result);
      }
    ]
  }
];