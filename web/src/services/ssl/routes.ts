
import { Request, Response, request, response } from "express";
import { sslUpload, sslInstall} from "./ssl-controller";
import { checkRequiredParams } from "../../middleware/validator";
import HttpStatus from 'http-status-codes';

export default [
    {
        path: "/api/v1/tls/bundle",
        method: "post",
        handler: [
            checkRequiredParams,
            async (req: Request, res: Response) => {
                const result = await sslUpload(req, res);
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
                const result = await sslInstall(req, res);
                res.status(HttpStatus.OK).send(result);
            }
        ]
    }  
];