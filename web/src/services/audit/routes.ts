
import { Request, Response, request, response } from "express";
import { downloadAuditlog, showAuditlog } from "./audit-controller";
import { checkRequiredParams } from "../../middleware/validator";
import HttpStatus from 'http-status-codes';

export default [
  {
    path: "/api/v1/auditlogs/download/:component",
    method: "get",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        const result = await downloadAuditlog(req, res);        
        res.status(HttpStatus.OK).send(result);
      }
    ]
  },
  {
    path: "/api/v1/auditlogs/show/:component",
    method: "get",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        const result = await showAuditlog(req, res);
        res.status(HttpStatus.OK).send(result);
      }
    ]
  }

];