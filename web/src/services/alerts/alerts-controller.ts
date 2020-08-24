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
export const getAlertsHistory = async (req: Request, res: Response) => {
    let alertHistoryData = Api.getAll(apiRegister.alerts_history, req, res);
    let result = await alertHistoryData;
    return result;
};

export const getAlertHistrorydetailsById = async (req: Request, res: Response) => {
    let getAlertHistrorydetails = Api.getAll(apiRegister.alerts_history + "/" + req.params.alert_id, req, res);
    let result = await getAlertHistrorydetails;
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
