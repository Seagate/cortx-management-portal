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
export const sslCertificateUpload = async (req: Request, res: Response) => {
  const result = await Api.uploadFiles(apiRegister.get_ssl_upload_endpt(req.params.version), req, res);
  return result;
};
/**
 * This method for install ssl certificate.
 * @param req 
 * @param res 
 */
export const sslCertificateInstall = async (req: Request, res: Response) => {
  let uploadCertificate = Api.post(apiRegister.get_ssl_install_endpt(req.params.version), req, res);
  return uploadCertificate;
};
export const certificateAvailability = async (req: Request, res: Response) => {
  const result = await Api.getAll(apiRegister.get_ssl_status_endpt(req.params.version), req, res);
  return result;
};
export const certificateDetails = async (req: Request, res: Response) => {
  const result = await Api.getAll(apiRegister.get_ssl_details_endpt(req.params.version), req, res);
  return result;
};
