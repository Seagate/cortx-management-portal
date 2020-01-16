/*****************************************************************************
 Filename:          s3-controller.ts
 Description:       Gets the data from provider and process it and send back
                    to client.

 Creation Date:     11/11/2019
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/

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