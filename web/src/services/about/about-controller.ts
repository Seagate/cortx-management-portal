/*****************************************************************************
 Filename:          AboutController.ts
 Description:       Gets the product's about details

 Creation Date:     06/16/2020
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
import { Request, Response } from "express";

/**
 * This method is responsible to get version
 */
export const getVersion = async (req: Request, res: Response) => {
    let versionData = Api.getAll(apiRegister.product_version, req, res);
    let result = await versionData;
    return result;
};
