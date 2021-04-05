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
import { Request, Response, request, response } from "express";
import { getUsers, getUserById, saveUser, deleteUser, updateUser, getUserPermissions} from "./user-controller";
import { checkApiVersion, checkRequiredParams } from "../../middleware/validator";
import HttpStatus from 'http-status-codes';

export default [
  {
    path: "/api/:version/csm/users",
    method: "get",
    handler: [
      checkApiVersion,
      checkRequiredParams,
      async (req: Request, res: Response) => {
        const result = await getUsers(req, res);
        res.status(res.statusCode).send(result);
      }
    ]
  },
  {
    path: "/api/:version/csm/users",
    method: "post",
    handler: [
      checkApiVersion,
      checkRequiredParams,
      async (req: Request, res: Response) => {
        const result = await saveUser(req, res);
        res.status(res.statusCode).send(result);
      }
    ]
  },
  {
    path: "/api/:version/csm/users/:user_id",
    method: "get",
    handler: [
      checkApiVersion,
      checkRequiredParams,
      async (req: Request, res: Response) => {
        const result = await getUserById(req, res);
        res.status(res.statusCode).send(result);
      }
    ]
  },
  {
    path: "/api/:version/csm/users/:user_id",
    method: "patch",
    handler: [
      checkApiVersion,
      checkRequiredParams,
      async (req: Request, res: Response) => {
        const result = await updateUser(req, res);
        res.status(res.statusCode).send(result);
      }
    ]
  },
  {
    path: "/api/:version/csm/users/:user_id",
    method: "delete",
    handler: [
      checkApiVersion,
      checkRequiredParams,
      async (req: Request, res: Response) => {
        const result = await deleteUser(req, res);
        res.status(res.statusCode).send(result);
      }
    ]
  },
  {
    path: "/api/:version/permissions",
    method: "get",
    handler: [
      checkApiVersion,
      checkRequiredParams,
      async (req: Request, res: Response) => {
        const result = await getUserPermissions(req, res);
        res.status(res.statusCode).send(result);
      }
    ]
  }
];