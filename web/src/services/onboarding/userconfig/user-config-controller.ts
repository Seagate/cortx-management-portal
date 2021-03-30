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
import { Api } from "./../../api";
import apiRegister from "./../../api-register";
import { Request, Response, request, response } from "express";

/**
 * This is responsible for getting User Configuration data
 * @param query 
 */
export const getUserConfig = async (req: Request, res: Response) => {
    let alertData = Api.getAll(apiRegister.get_all_system_config(req.params.version), req, res);
    let result = await alertData;
    return result;
};

/**
 * This is responsible to store User Configuration data.
 * @param req 
 * @param res 
 */
export const saveUserConfig = async (req: Request, res: Response) => {
    let alertData = Api.post(apiRegister.get_all_system_config(req.params.version), req, res);
    let result = await alertData;
    return result;
};

/**
 * 
 * @param req Updates user config data
 * @param res 
 */
export const updateUserConfig= async (req: Request, res: Response) => {
    let alertData = Api.put(apiRegister.get_all_system_config(req.params.version), req, res, req.params.user_config_id);
    let result = await alertData;
    return result;
};