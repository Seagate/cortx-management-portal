
import { Request, Response, request, response } from "express";
import { getSessionKey, saveUser, logout, getAdminUser } from "./login-controller";
import { checkRequiredParams } from "../../middleware/validator";
import HttpStatus from 'http-status-codes';

export default [
  {
    path: "/api/v1/sessionkey",
    method: "get",
    handler: [
      checkRequiredParams, // <-- this line
      async (req: Request, res: Response) => {
        const result = await getSessionKey(req.query.user);
        res.status(HttpStatus.OK).send(result);
      }
    ]
  },
  {
    path: "/api/v1/login",
    method: "post",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        // const result: any = await getAdminUser(req, res).then(user => {
        //   return user
        // });
        // if (result.username == req.body.username && result.password == req.body.password) {
        //   const userResponse = await getSessionKey(req.body.username);
        //   res.status(HttpStatus.OK).send(userResponse);
        // } else {
        //   res.status(HttpStatus.UNAUTHORIZED).send();
        // }
        let auth_token = "";
        const result = await getAdminUser(req, res).then((response: any) =>{
          console.log(response.headers);
        });;
        res.status(HttpStatus.OK).send(result);
      }
    ]
  },
  {
    path: "/api/v1/logout",
    method: "get",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        const result = await logout(req, res);
        res.status(HttpStatus.OK).send(result);        
      }
    ]
  },
  {
    path: "/api/v1/user/admin",
    method: "post",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        const result = await saveUser(req, res);
        res.status(HttpStatus.OK).send();        
      }
    ]
  }
];