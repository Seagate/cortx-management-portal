/*****************************************************************************
 Filename:          UDXController.ts
 Description:       Gets the data from provider and process it and send back
                    to client.

 Creation Date:     10/31/2019
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
import { randomBytes } from "crypto";

const devices: any[] = [];
let isUDXRegistered: any = {
    isRegistered: false
};

export const getUDXDevices = async (req: Request, res: Response) => {
    /*let result = await Api.getAll(apiRegister.udx_devices, req, res);
    return result;*/
    return devices;
};

export const getIdentificationToken = async (req: Request, res: Response) => {
    /*let result = await Api.getAll(apiRegister.udx_reg_token, req, res);
    return result;*/
    const pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return {
        registrationToken: [...randomBytes(12)].map(x => pool[x % pool.length]).join('')
    };
};


export const registerUDX = async (req: Request, res: Response) => {
    /*let result = await Api.post(apiRegister.udx_register_device, req, res);
    return result;*/
    devices.push({
        name: "Test name 1",
        productID: "Test product id 1",
        serialNumber: "Test serial number 1",
        type: "Test type 1",
        uuid: "Test UUID",
        vendorID: "Test vendor id"
    });
    isUDXRegistered.isRegistered = true;
    return {
        s3_account: {
          access_key: "AAABBBCCC",
          secret_key: "DDDEEEFFF"
        },
        iam_user: {
          access_key: "GGGHHHIII",
          secret_key: "JJJKKKLLL"
        }
    };
};

export const getUDXRegistrationStatus = async (req: Request, res: Response) => {
    /*let result;
    try {
        await Api.getAll(apiRegister.udx_register_device, req, res);
        result = {"isRegistered": true};
    } catch(exception) {
        result = {"isRegistered": false};
    }*/
    return isUDXRegistered;
};
