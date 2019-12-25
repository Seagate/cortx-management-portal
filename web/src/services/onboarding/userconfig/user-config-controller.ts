/*****************************************************************************
 Filename:          user-config-controller.ts
 Description:       Gets the data from provider and process it and send back
                    to client.

 Creation Date:     12/12/2019
 Author:            Soniya Moholkar

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/

import { Api } from "./../../api";
import apiRegister from "./../../api-register";
import { Request, Response, request, response } from "express";

/**
 * This is responsible for getting User Configuration data
 * @param query 
 */
export const getUserConfig = async (req: Request, res: Response) => {
    let alertData = Api.getAll(apiRegister.all_system_config, req, res);
    let result = await alertData;
    return result;
};

/**
 * This is responsible to store User Configuration data.
 * @param req 
 * @param res 
 */
export const saveUserConfig = async (req: Request, res: Response) => {
    let alertData = Api.post(apiRegister.all_system_config, req, res);
    let result = await alertData;
    return result;
};

/**
 * 
 * @param req Updates user config data
 * @param res 
 */
export const updateUserConfig= async (req: Request, res: Response) => {
    let alertData = Api.put(apiRegister.all_system_config, req, res, req.params.user_config_id);
    let result = await alertData;
    return result;
};