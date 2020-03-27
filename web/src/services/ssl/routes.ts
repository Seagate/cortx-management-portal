
import { Request, Response, request, response } from "express";
import { sslCertificateUpload, sslCertificateInstall} from "./ssl-controller";
import { checkRequiredParams } from "../../middleware/validator";
import HttpStatus from 'http-status-codes';

export default [
    {
        path: "/api/v1/tls/bundle",
        method: "post",
        handler: [
            checkRequiredParams,
            async (req: Request, res: Response) => {
                const result = await sslCertificateUpload(req, res);
                res.status(HttpStatus.OK).send(result);
            }
        ]
    } ,
    {
        path: "/api/v1/tls/bundle",
        method: "patch",
        handler: [
            checkRequiredParams,
            async (req: Request, res: Response) => {
                const result = await sslCertificateInstall(req, res);
                res.status(HttpStatus.OK).send(result);
            }
        ]
    }  
];