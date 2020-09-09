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
import axios from "axios";
import router from "../router"; // Get router object from our router.ts
import { ApiResponse } from "./api-model";

// Add a request interceptor
// Set valid token into each request header
// Note: - if welcome page no need of auth token
//       - if create admin user page no need of auth token
axios.interceptors.request.use(
  config => {
    const constStr = require("../common/const-string.json");
    const token = localStorage.getItem(constStr.access_token);
    if (token) {
      config.headers.Authorization = token;
    }
    if (config.timeout === -1) {
      config.timeout = 0;
    } else if (config.timeout === 0) {
      config.timeout = 20000;
    }
    if (document.hidden) {
      config = {
        ...config,
        cancelToken: new axios.CancelToken((cancel) => cancel("Request cancelled as page is idle"))
      };
    }
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
      const constStr = require("../common/const-string.json");
      localStorage.removeItem(constStr.access_token);
      localStorage.removeItem(constStr.username);
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

export abstract class Api {
  // Wrapper method to for get api
  public static async getAll(
    url: string,
    queryParams?: object
  ): Promise<ApiResponse> {
    return await axios
      .get(url, { params: queryParams })
      .then(response => {
        return Promise.resolve(this.buildSuccessResponse(response));
      })
      .catch(error => {
        const apiResponse: ApiResponse = this.getResponseFromError(error);
        return Promise.reject(apiResponse);
      });
  }
  // Wrapper method to for get api
  public static async getFile(url: string, queryParams?: object) {
    return await axios.get(url, { responseType: "blob" });
  }
  // Wrapper method for update api
  public static async patch(
    url: string,
    payload: object,
    id?: string,
    config?: object
  ) {
    const tempURL = id ? url + "/" + id : url;
    return await axios
      .patch(tempURL, payload, config)
      .then(response => {
        return Promise.resolve(this.buildSuccessResponse(response));
      })
      .catch(error => {
        const apiResponse: ApiResponse = this.getResponseFromError(error);
        return Promise.reject(apiResponse);
      });
  }
  // Wrapper method for post api
  public static async post(url: string, payload: object, config?: object) {
    return await axios
      .post(url, payload, config)
      .then(response => {
        return Promise.resolve(this.buildSuccessResponse(response));
      })
      .catch(error => {
        const apiResponse: ApiResponse = this.getResponseFromError(error);
        return Promise.reject(apiResponse);
      });
  }
  // Wrapper method for post api to upload file
  public static async uploadFile(url: string, payload: FormData) {
    return await axios
      .post(url, payload, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        timeout: -1
      })
      .then(response => {
        return Promise.resolve(this.buildSuccessResponse(response));
      })
      .catch(error => {
        const apiResponse: ApiResponse = this.getResponseFromError(error);
        return Promise.reject(apiResponse);
      });
  }
  // Wrapper method for post api
  public static async delete(url: string, id: string, payload?: object) {
    const tempURL = id ? url + "/" + id : url;
    return await axios
      .delete(tempURL, payload)
      .then(response => {
        return Promise.resolve(this.buildSuccessResponse(response));
      })
      .catch(error => {
        const apiResponse: ApiResponse = this.getResponseFromError(error);
        return Promise.reject(apiResponse);
      });
  }
  // Wrapper method for update api
  public static async put(
    url: string,
    payload: object,
    id: string,
    config?: object
  ) {
    const tempURL = id ? url + "/" + id : url;
    return await axios
      .put(tempURL, payload, config)
      .then(response => {
        return Promise.resolve(this.buildSuccessResponse(response));
      })
      .catch(error => {
        const apiResponse: ApiResponse = this.getResponseFromError(error);
        return Promise.reject(apiResponse);
      });
  }

  private static buildSuccessResponse(response: any): ApiResponse {
    const apiResponse: ApiResponse = {
      data: response.data,
      headers: response.headers,
      status: response.status,
      statusText: response.statusText
    };
    return apiResponse;
  }

  private static getResponseFromError(error: any): ApiResponse {
    let apiResponse: ApiResponse;
    if (error.code && error.code === "ECONNABORTED") {
      apiResponse = this.buildReqCancelledWarnResp(error);
    } else {
      apiResponse = this.buildErrorResponse(error);
    }
    return apiResponse;
  }

  private static buildErrorResponse(error: any): ApiResponse {
    const apiResponse: ApiResponse = {} as ApiResponse;
    if (error.response) {
      apiResponse.data = error.response.data ? error.response.data : {};
      apiResponse.error = {
        name: "Error: " + error.response.status,
        message: error.response.statusText
      };
      apiResponse.status = error.response.status;
      apiResponse.statusText = error.response.statusText;
    } else {
      apiResponse.status = 499;
      apiResponse.statusText = error.message ? error.message : "Request cancelled";
    }
    return apiResponse;
  }

  private static buildReqCancelledWarnResp(error: any): ApiResponse {
    const apiResponse: ApiResponse = {
      status: error.code,
      statusText: error.message,
      warning: {
        message:
          "Server is taking too long to respond. Please refresh the page."
      }
    };
    return apiResponse;
  }
}
