/*****************************************************************************
 Filename:          on-boarding-controller.ts
 Description:       Gets the data from provider and process it and send back
                    to client.

 Creation Date:     21/08/2019
 Author:            Soniya Moholkar

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/

import { Api } from "../api";
import apiRegister from "../api-register";
import { Request, Response, request, response } from "express";

/**
 * This is responsible for getting System Configuration data
 * @param query 
 */
export const getAllSystemConfig = async (req: Request, res: Response) => {
    return await Api.getAll(apiRegister.all_system_config, req, res);    
};

/**
 * This is responsible for getting System Configuration data
 * @param query 
 */
export const getSystemConfig = async (req: Request, res: Response) => {
    return await Api.get(apiRegister.all_system_config, req, res, req.params.config_id);    
};

/**
 * This is responsible to store System Configuration data.
 * @param req 
 * @param res 
 */
export const saveSystemConfig = async (req: Request, res: Response) => {
    return await Api.post(apiRegister.all_system_config, req, res);    
};

export const updateSystemConfig = async (req: Request, res: Response) => {
    return await Api.put(apiRegister.all_system_config, req, res, req.params.config_id);    
};