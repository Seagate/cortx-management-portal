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
import {
  getNodeStatus,
  startNode,
  stopNode,
  shutdownNode,
  getHealthSummary,
  getHealthView,
  getNodeHealth,
  getHealthComponents,
  getHealthResources
} from "./system-controller";
import { checkRequiredParams } from "./../../middleware/validator";
import HttpStatus from "http-status-codes";

/**
 * It has all the REST APIs to get the system related details.
 */

export default [
  {
    path: "/api/v1/system/health/summary",
    method: "get",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await getHealthSummary(req, res);
          res.status(res.statusCode).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  },
  {
    path: "/api/v1/system/health/view",
    method: "get",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await getHealthView(req, res);
          res.status(res.statusCode).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  },
  {
    path: "/api/v1/system/health/components",
    method: "get",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await getHealthComponents(req, res);
          res.status(res.statusCode).send(result);
        } catch (err) {
          throw err;
        }
      },
    ],
  },
  {
    path: "/api/v1/system/health/resources",
    method: "get",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await getHealthResources(req, res);
          res.status(res.statusCode).send(result);
        } catch (err) {
          throw err;
        }
      },
    ],
  },
  {
    path: "/api/v1/system/health/node",
    method: "get",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await getNodeHealth(req, res);
          res.status(res.statusCode).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  },
  {
    path: "/api/v1/maintenance/cluster/node_status",
    method: "get",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await getNodeStatus(req, res);
          res.status(res.statusCode).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  },
  {
    path: "/api/v1/maintenance/cluster/start",
    method: "post",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await startNode(req, res);
          res.status(res.statusCode).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  },
  {
    path: "/api/v1/maintenance/cluster/stop",
    method: "post",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await stopNode(req, res);
          res.status(res.statusCode).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  },
  {
    path: "/api/v1/maintenance/cluster/shutdown",
    method: "post",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await shutdownNode(req, res);
          res.status(res.statusCode).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  },
  // commented as per bug EOS-13871
  // {
  //   path: "/api/v1/maintenance/cluster/replace_node_status",
  //   method: "get",
  //   handler: [
  //     checkRequiredParams,
  //     async (req: Request, res: Response) => {
  //       try {
  //         const result = await getNodeReplacementStatus(req, res);
  //         res.status(res.statusCode).send(result);
  //       } catch (err) {
  //         throw err;
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: "/api/v1/maintenance/cluster/replace_node",
  //   method: "post",
  //   handler: [
  //     checkRequiredParams,
  //     async (req: Request, res: Response) => {
  //       try {
  //         const result = await replaceNode(req, res);
  //         res.status(res.statusCode).send(result);
  //       } catch (err) {
  //         throw err;
  //       }
  //     }
  //   ]
  // }
];
