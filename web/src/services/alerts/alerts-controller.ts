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

import { Api } from "./../api";
import apiRegister from "./../api-register";
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
export const getAlerts = async (req: Request, res: Response) => {
    let alertData = Api.getAll(apiRegister.all_alerts, req, res);
    let result = await alertData;
    return result;
};

export const getAlertById = async (req: Request, res: Response) => {
    let alertData = Api.getAll(apiRegister.all_alerts + "/" + req.params.alert_id, req, res);
    let result = await alertData;
    return result;
};

export const updateAlert = async (req: Request, res: Response) => {
    let alertData = Api.patch(apiRegister.all_alerts, req, res, req.params.alert_id);
    let result = await alertData;
    return result;
};

export const updateAlerts = async (req: Request, res: Response) => {
    let alertData = Api.patch(apiRegister.all_alerts, req, res, "");
    let result = await alertData;
    return result;
};

export const getCommentsForAlert = async (req: Request, res: Response) => {
    const url = apiRegister.all_alerts + "/" + req.params.alert_id + "/comments";
    return await Api.getAll(url, req, res);
};

export const addCommentToAlert = async (req: Request, res: Response) => {
    const url = apiRegister.all_alerts + "/" + req.params.alert_id + "/comments";
    return await Api.post(url, req, res);
};

