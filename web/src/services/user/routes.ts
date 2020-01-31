/*****************************************************************************
 Filename:          routes.ts
 Description:       REST APIs to get, save, update CSM User

 Creation Date:     11/25/2019
 Author:            Soniya Moholkar

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
import { Request, Response, request, response } from "express";
import { getUsers, getUserById, saveUser, deleteUser, updateUser, getUserPermissions} from "./user-controller";
import { checkRequiredParams } from "../../middleware/validator";
import HttpStatus from 'http-status-codes';

export default [
  {
    path: "/api/v1/user",
    method: "get",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        const result = await getUsers(req, res);
        res.status(HttpStatus.OK).send(result);        
      }
    ]
  },
  {
    path: "/api/v1/user",
    method: "post",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        const result = await saveUser(req, res);
        res.status(HttpStatus.OK).send(result);        
      }
    ]
  },
  {
    path: "/api/v1/user/:user_id",
    method: "get",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        const result = await getUserById(req, res);
        res.status(HttpStatus.OK).send(result);        
      }
    ]
  },
  {
    path: "/api/v1/user/:user_id",
    method: "put",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        const result = await updateUser(req, res);
        res.status(HttpStatus.OK).send(result);        
      }
    ]
  },
  {
    path: "/api/v1/user/:user_id",
    method: "delete",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        const result = await deleteUser(req, res);
        res.status(HttpStatus.OK).send(result);        
      }
    ]
  },
  {
    path: "/api/v1/permissions",
    method: "get",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        const result = await getUserPermissions(req, res);
        res.status(HttpStatus.OK).send(result);
      }
    ]
  }
];