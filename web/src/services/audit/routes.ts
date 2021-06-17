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
import { Request, Response, request, response } from "express";
import { downloadAuditlog, showAuditlog } from "./audit-controller";
import { checkApiVersion, checkRequiredParams } from "../../middleware/validator";
import * as audit_log_headers from './audit-log-headers.json';

export default [
  {
    path: "/api/:version/auditlogs/download/:component",
    method: "get",
    handler: [
      checkApiVersion,
      checkRequiredParams,
      async (req: Request, res: Response) => {
        const result = await downloadAuditlog(req, res);        
        res.status(res.statusCode).send(result);
      }
    ]
  },
  {
    path: "/api/:version/auditlogs/show/:component",
    method: "get",
    handler: [
      checkApiVersion,
      checkRequiredParams,
      async (req: Request, res: Response) => {
        const result = await showAuditlog(req, res);
        res.status(res.statusCode).send(result);
      }
    ]
  },
  {
    path: "/api/:version/auditlogs/csm-headers",
    method: "get",
    handler: [
      checkApiVersion,
      checkRequiredParams,
      async (req: Request, res: Response) => {
        res.status(res.statusCode).send(audit_log_headers.auditLogHeaders);
      }
    ]
  }

];