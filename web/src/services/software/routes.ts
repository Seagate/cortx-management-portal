import { Request, Response, request, response } from "express";
import {
  getLastUpgradeStatus,
  hotfixUpload,
  startUpgrade
} from "./software-controller";
import { checkRequiredParams } from "../../middleware/validator";
import HttpStatus from "http-status-codes";

export default [
  {
    path: "/api/v1/upgrade/hotfix/status",
    method: "get",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        const result = await getLastUpgradeStatus(req, res);
        res.status(res.statusCode).send(result);
      }
    ]
  },
  {
    path: "/api/v1/upgrade/hotfix/upload",
    method: "post",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        const result = await hotfixUpload(req, res);
        res.status(res.statusCode).send(result);
      }
    ]
  },
  {
    path: "/api/v1/upgrade/hotfix/start",
    method: "post",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        const result = await startUpgrade(req, res);
        res.status(res.statusCode).send(result);
      }
    ]
  }
];
