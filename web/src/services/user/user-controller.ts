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
import { Api } from "../api";
import apiRegister from "../api-register";
import { Request, Response, request, response } from "express";

/**
 * This method is to get the user by Id.
 * @param req 
 * @param res 
 */
export const getUserById = async (req: Request, res: Response) => {
  let url = apiRegister.get_csm_user_endpt(req.params.version);
  if(req.params.user_id){
    url += "/" + req.params.user_id;
  }
  
  let csmusers = Api.getAll(url, req, res);
  return csmusers;
};

/**
 * This method is to get all the CSM users
 * @param req 
 * @param res 
 */
export const getUsers = async (req: Request, res: Response) => {
  let csmusers = Api.getAll(apiRegister.get_csm_user_endpt(req.params.version), req, res);
  return csmusers;
};

/**
 * This method creates the new CSM user.
 * @param req 
 * @param res 
 */
export const saveUser = async (req: Request, res: Response) => {
  let adminUser = Api.post(apiRegister.get_csm_user_endpt(req.params.version), req, res);
  return adminUser;
};

/**
 * This method updates the CSM user.
 * @param req 
 * @param res 
 */
export const updateUser = async (req: Request, res: Response) => {
  let adminUser = Api.patch(apiRegister.get_csm_user_endpt(req.params.version), req, res, req.params.user_id);
  return adminUser;
};

/**
 * This method deletes the CSM user.
 * @param req 
 * @param res 
 */
export const deleteUser = async (req: Request, res: Response) => {
  let adminUser = Api.delete(apiRegister.get_csm_user_endpt(req.params.version), req, res, req.params.user_id);
  return adminUser;
};
/**
 * This is responsible for getting user permissions
 * @param req 
 * @param res
 */
export const getUserPermissions = async (req: Request, res: Response) => {
  return await Api.getAll(apiRegister.get_user_permissions_endpt(req.params.version), req, res);
};
/**
 * This is responsible for getting user unsupported features
 * @param req 
 * @param res
 */
export const getUnsupportedFeatures = async (req: Request, res: Response) => {
  return await Api.getAll(apiRegister.get_unsupported_features_endpt(req.params.version), req, res);
};