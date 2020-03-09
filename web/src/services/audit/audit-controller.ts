/*****************************************************************************
 Filename:          audit-controller.ts
 Description:       Gets the data from provider and process it and send back
                    to client.

 Creation Date:     06/03/2020
 Author:            Sanjeevan Bhave

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/

import { Api } from "./../api";
import apiRegister from "./../api-register";
import { Request, Response, request, response } from "express";

export const downloadAuditlog = async (req: Request, res: Response) => {
  let url = apiRegister.auditlogs;
  if (req.params.component) {
    url += "/download/" + req.params.component;
  }
  let auditlog = await Api.getFile(url, req, res);
  return auditlog;
};

export const showAuditlog = async (req: Request, res: Response) => {
  let url = apiRegister.auditlogs;
  if (req.params.component) {
    url += "/show/" + req.params.component;
  }
  let auditlog = Api.getAll(url, req, res);
  return auditlog;
};


