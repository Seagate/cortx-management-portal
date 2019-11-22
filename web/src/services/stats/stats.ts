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
 * This is responsible for getting stats data
 * @param query 
 */
export const getStats = async (req: Request, res: Response, pathparam?: string) => {
    let url = apiRegister.stats;
    if (pathparam) {
        url += "/" + pathparam;
    }
    let alertData = Api.getAll(url, req, res);
    let result = await alertData;
    return result;
};