/*****************************************************************************
 Filename:          routes.ts
 Description:       REST APIs to get system details

 Creation Date:     26/02/2020
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 **************************************************************************** */

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
  getNodeReplacementStatus,
  replaceNode
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
  {
    path: "/api/v1/maintenance/cluster/replace_node_status",
    method: "get",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await getNodeReplacementStatus(req, res);
          res.status(res.statusCode).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  },
  {
    path: "/api/v1/maintenance/cluster/replace_node",
    method: "post",
    handler: [
      checkRequiredParams,
      async (req: Request, res: Response) => {
        try {
          const result = await replaceNode(req, res);
          res.status(res.statusCode).send(result);
        } catch (err) {
          throw err;
        }
      }
    ]
  }
];
