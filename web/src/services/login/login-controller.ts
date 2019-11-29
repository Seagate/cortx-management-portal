import { getSessionKeys } from "./providers/session-provider";
import { Api } from "./../api";
import apiRegister from "./../api-register";
import { Request, Response, request, response } from "express";

export const getSessionKey = async (user: string) => {
  // if (q.length < 3) {
  //   return {
  //     type: "FeatureCollection",
  //     features: []
  //   };
  // }

  return await getSessionKeys(user);
};

/**
 * This method is to get the admin user details
 * @param req 
 * @param res 
 */
export const getAdminUser = async (req: Request, res: Response) => {
  let adminUser = Api.post(apiRegister.admin_user, req, res);
  return adminUser;
};

/**
 * This method is to get the admin user details
 * @param req 
 * @param res 
 */
export const logout = async (req: Request, res: Response) => {
  let adminUser = Api.post(apiRegister.admin_user_logout, req, res)
  return adminUser;
};

/**
 * This method creates the new admin user.
 * @param req 
 * @param res 
 */
export const saveUser = async (req: Request, res: Response) => {
  let adminUser = Api.post(apiRegister.admin_user_create, req, res);
  return adminUser;
};