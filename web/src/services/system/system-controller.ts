/*****************************************************************************
 Filename:          system-controller.ts
 Description:       Gets the data from provider and process it and send back
                    to client.

 Creation Date:     26/02/2020
 Author:            Sri Bhargav Metta
                    Soniya Moholkar

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/

import { Api } from "./../api";
import apiRegister from "./../api-register";
import { Request, Response } from "express";

export default class SystemController {
  public async getHealthSummary(req: Request, res: Response) {
    let healthSummaryData = await Api.getAll(
      apiRegister.health_summary,
      req,
      res
    );
    return healthSummaryData;
  }

  public async getHealthView(req: Request, res: Response) {
    let healthSummaryData = await Api.getAll(apiRegister.health_view, req, res);
    return healthSummaryData;
  }

  public async getNodeHealth(req: Request, res: Response) {
    let healthSummaryData = await Api.getAll(apiRegister.node_health, req, res);
    return healthSummaryData;
  }
}

/**
 * This is responsible to fetching node status.
 * @param req
 * @param res
 */
export const getNodeStatus = async (req: Request, res: Response) => {
  let nodeStatusData = await Api.getAll(apiRegister.node_status, req, res);
  return nodeStatusData;
};

/**
 * This is responsible to stop node.
 * @param req
 * @param res
 */
export const stopNode = async (req: Request, res: Response) => {
  return await Api.post(apiRegister.node_stop, req, res);
};
/**
 * This is responsible to start node.
 * @param req
 * @param res
 */
export const startNode = async (req: Request, res: Response) => {
  return await Api.post(apiRegister.node_start, req, res);
};
/**
 * This is responsible to shutdown node.
 * @param req
 * @param res
 */
export const shutdownNode = async (req: Request, res: Response) => {
  return await Api.post(apiRegister.node_shutdown, req, res);
};
