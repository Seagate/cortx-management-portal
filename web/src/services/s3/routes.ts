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
import { Request, Response } from "express";
import { getAllAccounts, createAccount, deleteAccount, getAllIAMUsers, createIAMUser, deleteIAMUser, resetPassword, updateAccount } from "./s3-controller";
import { checkRequiredParams } from './../../middleware/validator';
import HttpStatus from 'http-status-codes';


/**
 * It has all the REST APIs to get the alert related details. 
 */

export default [
  {
    path: "/api/v1/s3_accounts",
    method: "get",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await getAllAccounts(req, res);
          res.status(res.statusCode).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  },
  {
    path: "/api/v1/s3_accounts/:name",
    method: "get",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          console.log(req.params.name);
          const result = await getAllAccounts(req, res);
          res.status(res.statusCode).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  },
  {
    path: "/api/v1/s3_accounts",
    method: "post",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await createAccount(req, res);
          res.status(res.statusCode).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  },
  {
    path: "/api/v1/s3_accounts/:name",
    method: "delete",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await deleteAccount(req.params.name, req, res);
          res.status(res.statusCode).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  },
  {
    path: "/api/v1/iam_users",
    method: "get",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await getAllIAMUsers(req, res);
          res.status(res.statusCode).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  },
  {
    path: "/api/v1/iam_users/:name",
    method: "get",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          console.log(req.params.name);
          const result = await getAllIAMUsers(req, res);
          res.status(res.statusCode).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  },
  {
    path: "/api/v1/iam_users",
    method: "post",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await createIAMUser(req, res);
          res.status(res.statusCode).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  },
  {
    path: "/api/v1/iam_users/:username",
    method: "delete",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await deleteIAMUser(req.params.username, req, res);
          res.status(res.statusCode).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  },
  {
    path: "/api/v1/iam_users/:account_name",
    method: "patch",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await resetPassword(req, res);
          res.status(res.statusCode).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  },
  {
    path: "/api/v1/s3_accounts/:account_name",
    method: "patch",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await updateAccount(req, res);
          res.status(res.statusCode).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  },
];