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
    getNodeStopClusterStatus,
    manageResource
} from "./cluster-management-controller";
import { checkApiVersion, checkRequiredParams } from "./../../middleware/validator";

/**
 * It has all the REST APIs to manage cluster.
 */
export default [
    {
        path: "/api/:version/system/management/cluster_status/:node_id",
        method: "get",
        handler: [
            checkApiVersion,
            checkRequiredParams,
            async (req: Request, res: Response) => {
                try {
                    const result = await getNodeStopClusterStatus(req, res);
                    res.status(res.statusCode).send(result);
                } catch (err) {
                    throw err;
                }
            }
        ]
    },
    {
        path: "/api/:version/system/management/:resource",
        method: "post",
        handler: [
            checkApiVersion,
            checkRequiredParams,
            async (req: Request, res: Response) => {
                try {
                    const result = await manageResource(req, res);
                    res.status(res.statusCode).send(result);
                } catch (err) {
                    throw err;
                }
            }
        ]
    }
];
