
import { Request, Response, request, response } from "express";
import { getLastUpgradeStatus, firmwareUpload, startUpgrade, packageAvailability } from "./firmware-controller";
import { checkRequiredParams } from "../../middleware/validator";
import HttpStatus from 'http-status-codes';

export default [
    {
        path: "/api/v1/upgrade/firmware/last_upgrade_status",
        method: "get",
        handler: [
            checkRequiredParams,
            async (req: Request, res: Response) => {
                const result = await getLastUpgradeStatus(req, res);
                res.status(HttpStatus.OK).send(result);
            }
        ]
    },
    {
        path: "/api/v1/upgrade/firmware/upload",
        method: "post",
        handler: [
            checkRequiredParams,
            async (req: Request, res: Response) => {
                const result = await firmwareUpload(req, res);
                res.status(HttpStatus.OK).send(result);
            }
        ]
    },
    {
        path: "/api/v1/upgrade/firmware/start",
        method: "get",
        handler: [
            checkRequiredParams,
            async (req: Request, res: Response) => {
                const result = await startUpgrade(req, res);
                res.status(HttpStatus.OK).send(result);
            }
        ]
    },
    {
        path: "/api/v1/upgrade/firmware/availibility",
        method: "get",
        handler: [
            checkRequiredParams,
            async (req: Request, res: Response) => {
                const result = await packageAvailability(req, res);
                res.status(HttpStatus.OK).send(result);
            }
        ]
    }
];