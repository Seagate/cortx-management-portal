/*****************************************************************************
 Filename:          api.ts
 Description:       API Service

 Creation Date:     05/09/2019
 Author:            Sanjeevan Bhave

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
import axios from "axios";
import router from "../router"; // Get router object from our router.ts
import { ApiResponse } from "./api-model";

// Add a request interceptor
// Set valid token into each request header
// Note: - if welcome page no need of auth token
//       - if create admin user page no need of auth token
axios.interceptors.request.use(
  config => {
    const conststr = require("../common/const-string.json");
    const token = localStorage.getItem(conststr.access_token);
    if (token) {
      config.headers.Authorization = token;
    }
    config.timeout = 10000;
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

// Handle response
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle Unauthorised response. Re-route to login page if unauthorised response received.
    if (error.response && error.response.status === 401) {
      const conststr = require("../common/const-string.json");
      localStorage.removeItem(conststr.access_token);
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

export abstract class Api {
  // Wrapper method to for get api
  public static async getAll(url: string, queryParams?: object): Promise<ApiResponse> {
    const apiResponse: ApiResponse = {} as ApiResponse;
    return await axios.get(url, { params: queryParams })
      .then((response) => {
        apiResponse.data = response.data;
        apiResponse.status = response.status;
        apiResponse.statusText = response.statusText;
        return Promise.resolve(apiResponse);
      }).catch((error) => {
        apiResponse.status = error.response.status;
        apiResponse.statusText = error.response.statusText;
        apiResponse.error = {
          name: "Error: " + error.response.status,
          message: error.response.statusText
        };
        return Promise.reject(apiResponse);
      });
  }
  // Wrapper method for update api
  public static async patch(url: string, payload: object, id?: string) {
    const tempURL = id ? url + "/" + id : url;
    return await axios.patch(tempURL, payload);
  }
  // Wrapper method for post api
  public static async post(url: string, payload: object) {
    return await axios.post(url, payload);
  }
  // Wrapper method for post api
  public static async delete(url: string, id: string) {
    if (!id) {
      return;
    }
    return await axios.delete(url + "/" + id);
  }
  // Wrapper method for update api
  public static async put(url: string, payload: object, id: string) {
    if (!id) {
      return;
    }
    return await axios.put(url + "/" + id, payload);
  }
}
