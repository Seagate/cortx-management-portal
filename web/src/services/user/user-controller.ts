/*****************************************************************************
 Filename:          user-controller.ts
 Description:       Manages the CSM user by connecting to CSM Agent
                    to client.

 Creation Date:     11/25/2019
 Author:            Soniya Moholkar

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
import { Api } from "../api";
import apiRegister from "../api-register";
import { Request, Response, request, response } from "express";

/**
 * This method is to get the user by Id.
 * @param req 
 * @param res 
 */
export const getUserById = async (req: Request, res: Response) => {
  let url = apiRegister.csm_user;
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
  let csmusers = Api.getAll(apiRegister.csm_user, req, res);
  return csmusers;
};

/**
 * This method creates the new CSM user.
 * @param req 
 * @param res 
 */
export const saveUser = async (req: Request, res: Response) => {
  let adminUser = Api.post(apiRegister.csm_user, req, res);
  return adminUser;
};

/**
 * This method updates the CSM user.
 * @param req 
 * @param res 
 */
export const updateUser = async (req: Request, res: Response) => {
  let adminUser = Api.put(apiRegister.csm_user, req, res, req.params.user_id);
  return adminUser;
};

/**
 * This method deletes the CSM user.
 * @param req 
 * @param res 
 */
export const deleteUser = async (req: Request, res: Response) => {
  let adminUser = Api.delete(apiRegister.csm_user, req, res, req.params.user_id);
  return adminUser;
};
/**
 * This is responsible for getting user permissions
 * @param req 
 * @param res
 */
export const getUserPermissions = async (req: Request, res: Response) => {
  return await Api.getAll(apiRegister.user_permissions, req, res);
};