
import { Request, Response, request, response } from "express";
import { sslCertificateUpload, sslCertificateInstall, certificateAvailability } from "./ssl-controller";
import { checkRequiredParams } from "../../middleware/validator";
import HttpStatus from 'http-status-codes';

export default [
    {
        path: "/api/v1/tls/bundle/upload",
        method: "post",
        handler: [
            checkRequiredParams,
            async (req: Request, res: Response) => {
                const result = await sslCertificateUpload(req, res);
                res.status(res.statusCode).send(result);
            }
        ]
    },
    {
        path: "/api/v1/tls/bundle/install",
        method: "post",
        handler: [
            checkRequiredParams,
            async (req: Request, res: Response) => {
                const result = await sslCertificateInstall(req, res);
                res.status(res.statusCode).send(result);
            }
        ]
    },
    {
        path: "/api/v1/tls/bundle/status",
        method: "get",
        handler: [
            checkRequiredParams,
            async (req: Request, res: Response) => {
                const result = await certificateAvailability(req, res);
                res.status(res.statusCode).send(result);
            }
        ]
    }
];