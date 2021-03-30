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

export const getLastUpgradeStatus = async (req: Request, res: Response) => {
    const result = await Api.getAll(apiRegister.get_last_upgrade_status(req.params.version), req, res);
    return result;
};

export const firmwareUpload = async (req: Request, res: Response) => {
    const result = await Api.uploadFiles(apiRegister.get_upload_firmware(req.params.version), req, res);
    return result;
};

export const startUpgrade = async (req: Request, res: Response) => {
    const result = await Api.post(apiRegister.get_start_firmware_upgrade(req.params.version), req, res);
    return result;
};

export const packageAvailability = async (req: Request, res: Response) => {
    const result = await Api.getAll(apiRegister.get_firmware_package_availability(req.params.version), req, res);
    return result;
};
