/*****************************************************************************
 Filename:          AlertController.ts
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
 * This method is responsible to get the alert data from provider and sends back
 * to client.
 * @param sortby 
 * @param sorttype 
 * @param pagesize 
 * @param pageno 
 * @param offset 
 * @param limit 
 */
export const getSystemConfig = async (query: any) => {
    let alertData = Api.getAll(apiRegister.all_system_config, query);
    let result = await alertData;
    return result;
};


export const saveSystemConfig = async (req: Request, res: Response) => {
    let alertData = Api.post(apiRegister.all_system_config, req);
    let result = await alertData;
    return result;
};

export const getNetworkManagement = async (query: any) => {
    let alertData = Api.getAll(apiRegister.management_network, query);
    let result = await alertData;
    return result;
};


export const updateNetworkManagement = async (req: Request, res: Response) => {
    let alertData = Api.patch(apiRegister.management_network, req, "");
    let result = await alertData;
    return result;
};