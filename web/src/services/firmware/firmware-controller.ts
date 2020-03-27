/*****************************************************************************
 Filename:          firmware-controller.ts
 Description:       Gets the data from provider and process it and send back
                    to client.

 Creation Date:     06/03/2020
 Author:            Sanjeevan Bhave

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

export const getLastUpgradeStatus = async (req: Request, res: Response) => {
    const result = await Api.getAll(apiRegister.last_upgrade_status, req, res);
    return result;
};

export const firmwareUpload = async (req: Request, res: Response) => {
    const result = await Api.uploadFiles(apiRegister.upload_firmware, req, res);
    return result;
};

export const startUpgrade = async (req: Request, res: Response) => {
    const result = await Api.post(apiRegister.start_firmware_upgrade, req, res);
    return result;
};

export const packageAvailability = async (req: Request, res: Response) => {
    const result = await Api.getAll(apiRegister.firmware_package_availability, req, res);
    return result;
};
