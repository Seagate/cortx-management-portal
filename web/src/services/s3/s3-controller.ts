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


export const getAllAccounts = async (req: Request, res: Response) => {
    let result: any = await Api.getAll(apiRegister.s3_accounts, req, res);
    return result;
};

export const createAccount = async (req: Request, res: Response) => {
    let result = await Api.post(apiRegister.s3_accounts, req, res);
    return result;
};

export const deleteAccount = async (accountName: string, req: Request, res: Response) => {
    let result = await Api.delete(apiRegister.s3_accounts, req, res, accountName);
    return result;
};

export const getAllIAMUsers = async (req: Request, res: Response) => {
    let result = await Api.getAll(apiRegister.iam_users, req, res);
    return result;
};

export const createIAMUser = async (req: Request, res: Response) => {
    let result = await Api.post(apiRegister.iam_users, req, res);
    return result;
};

export const deleteIAMUser = async (username: string, req: Request, res: Response) => {
    let tempUsername = encodeURI(username);
    let result = await Api.delete(apiRegister.iam_users, req, res, tempUsername);
    return result;
};

export const resetPassword = async (req: Request, res: Response) => {
    let resetPassword = Api.patch(apiRegister.iam_users, req, res, req.params.account_name);
    let result = await resetPassword;
    return result;
};
/**
 * 
 * @param req Update s3 account password data
 * @param res 
 */
export const updateAccount = async (req: Request, res: Response) => {
    let updatePassword = Api.patch(apiRegister.s3_accounts, req, res, req.params.account_name);
    let result = await updatePassword;
    return result;
};