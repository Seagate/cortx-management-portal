
import { Request, Response, request, response } from "express";
import { getSessionKey } from "./login-controller";
import { checkRequiredParams } from "../../middleware/validator";

export default [
  {
    path: "/api/v1/sessionkey",
    method: "get",
    handler: [
      checkRequiredParams, // <-- this line
      async ({ query }: Request, res: Response) => {
        const result = await getSessionKey(query.user);
        res.status(200).send(result);
      }
    ]
  }  
];