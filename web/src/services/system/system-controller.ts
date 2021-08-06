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
import { Api } from "./../api";
import apiRegister from "./../api-register";
import { Request, Response } from "express";


export const getHealthSummary = async (req: Request, res: Response)=> {
        let healthSummaryData = await Api.getAll(
          apiRegister.get_health_summary_endpt(req.params.version),
          req,
          res
    );
return healthSummaryData;
}

export const getHealthView = async (req: Request, res: Response)=> {
    let healthSummaryData = await Api.getAll(apiRegister.get_health_view_endpt(req.params.version), req, res);
    return healthSummaryData;
}

export const getHealthComponents = async (req: Request, res: Response)=> {
  let healthSummaryData = await Api.getAll(apiRegister.get_health_components_endpt(req.params.version), req, res);
  return healthSummaryData;
}

export const getHealthResources = async (req: Request, res: Response)=> {
  const healthResourcesData = await Api.getAll(apiRegister.get_health_resources_endpt(req.params.version), req, res);
  return healthResourcesData;
}

export const getNodeHealth = async (req: Request, res: Response)=> {
    let healthSummaryData = await Api.getAll(apiRegister.get_node_health_endpt(req.params.version), req, res);
    return healthSummaryData;
}

export const getClusterHealth = async (req: Request, res: Response)=> {
  let healthClusterData = await Api.getAll(apiRegister.get_health_cluster_endpt(req.params.version, req.params.resource), req, res);
  return healthClusterData;
}

export const getClusterStatus = async (req: Request, res: Response)=> {
  let clusterStatusData = await Api.getAll(apiRegister.get_cluster_status_endpt(req.params.version, req.params.node_id), req, res);
  return clusterStatusData;
}

export const getClusterOperation = async (req: Request, res: Response)=> {
  let clusterOperationData = await Api.post(apiRegister.get_cluster_operation_endpt(req.params.version, req.params.resource), req, res);
  return clusterOperationData;
}
/**
 * This is responsible to fetching node status.
 * @param req
 * @param res
 */
export const getNodeStatus = async (req: Request, res: Response) => {
  let nodeStatusData = await Api.getAll(apiRegister.get_node_status_endpt(req.params.version), req, res);
  return nodeStatusData;
};

/**
 * This is responsible to stop node.
 * @param req
 * @param res
 */
export const stopNode = async (req: Request, res: Response) => {
  return await Api.post(apiRegister.get_node_stop_endpt(req.params.version), req, res);
};
/**
 * This is responsible to start node.
 * @param req
 * @param res
 */
export const startNode = async (req: Request, res: Response) => {
  return await Api.post(apiRegister.get_node_start_endpt(req.params.version), req, res);
};
/**
 * This is responsible to shutdown node.
 * @param req
 * @param res
 */
export const shutdownNode = async (req: Request, res: Response) => {
  return await Api.post(apiRegister.get_node_shutdown_endpt(req.params.version), req, res);
};
/**
 * This is responsible to get node replacement status.
 * @param req
 * @param res
 */
// commented as per bug EOS-13871
// export const getNodeReplacementStatus = async (req: Request, res: Response) => {
//   return await Api.getAll(apiRegister.node_replace_status, req, res);
// };
/**
 * This is responsible to replace node.
 * @param req
 * @param res
 */
// export const replaceNode = async (req: Request, res: Response) => {
//   return await Api.post(apiRegister.node_replace, req, res);
// };
