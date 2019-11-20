/*****************************************************************************
 Filename:          api.ts
 Description:       API Service

 Creation Date:     24/09/2019
 Author:            Soniya Moholkar

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
import http from 'http';
import https from 'https';
import { Request } from "express";
import HttpStatus from 'http-status-codes';
import * as HTTPError from '../utils/http-errors';

let base_url = process.env.CSM_AGENT_PROTOCOL + "://" + process.env.CSM_AGENT_HOST
    + (process.env.CSM_AGENT_PORT ? ":" + process.env.CSM_AGENT_PORT : "");
let mock_base_url = "http://localhost:3001"; // Remove after all the Python APIs
let http_agent: any;
if (process.env.CSM_AGENT_PROTOCOL == 'http') {
    http_agent = http;
} else {
    http_agent = https;
}

var sucessCodeRegex = new RegExp('^2[0-9]*$');

export abstract class Api {

    // Wrapper method to for get api
    public static async getAll(url: string, query?: any) {
        return new Promise((resolve, reject) => {
            let geturl = base_url + url;

            // Remove following code onde all the Python APIs are ready
            // -- Start --
            /*if (!url.startsWith("/api")) {
                geturl = mock_base_url + url;
            }*/
            console.log("GET: " + geturl);
            // -- end --

            for (const key in query) {
                let seperator = (geturl.indexOf('?') == -1 ? '?' : '&');
                geturl += seperator + key + "=" + query[key];
            }
            http_agent.get(geturl, Api.handleResponse(resolve, reject)).on("error", (err: any) => {
                let error = new HTTPError.HTTP500Error(err.message);
                reject(error);
            });
        });
    }

    public static async patch(url: string, req: Request, id: string | number) {
        return new Promise((resolve, reject) => {
            const requestData = JSON.stringify(req.body);
            let patchurl = base_url + url;
            if (id && id != "") {
                patchurl += "/" + id;
            }
            // Remove following code onde all the Python APIs are ready
            // -- Start --
            if (!url.startsWith("/api")) {
                patchurl = mock_base_url + url + id;
            }
            console.log("PATCH: " + patchurl);
            // -- end --
            const options = {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': requestData.length
                }
            }

            let httpRequest = http_agent.request(patchurl, options, Api.handleResponse(resolve, reject)).on("error", (err: any) => {
                let error = new HTTPError.HTTP500Error(err.message);
                reject(error);
            });
            httpRequest.write(requestData);
            httpRequest.end();
        });
    }

    public static async post(url: string, req: Request, id?: string | number) {
        return new Promise((resolve, reject) => {
            const requestData = JSON.stringify(req.body);
            let posturl = base_url + url + ((id) ? "/" + id : "");
            // Remove following code onde all the Python APIs are ready
            // -- Start --
            /*if (!url.startsWith("/api")) {
                posturl = mock_base_url + url + ((id) ? "/" + id : "");
            }*/
            console.log("POST: " + posturl);
            // -- end --
            const options = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': requestData.length
                }
            }

            let httpRequest = http_agent.request(posturl, options, Api.handleResponse(resolve, reject)).on("error", (err: any) => {
                let error = new HTTPError.HTTP500Error(err.message);
                reject(error);
            });
            httpRequest.write(requestData);
            httpRequest.end();
        });
    }

    private static handleResponse(resolve: (value?: unknown) => void, reject: (value?: unknown) => void): any {
        return (resp: any) => {
            let data = '';
            let response: any;

            resp.on('data', (chunk: any) => {
                data += chunk;
            });
            resp.on('end', () => {
                try {
                    response = JSON.parse(data);
                } catch (err) {
                    response = data;
                }
                if (sucessCodeRegex.test(resp.statusCode)) {
                    resolve(response);
                } else {
                    let err = Api.handleError(resp.statusCode, response);
                    reject(err);
                }
            });
        };
    }

    private static handleError(statusCode: any, response: any): Error {
        if (statusCode == HttpStatus.BAD_REQUEST) {
            return new HTTPError.HTTP400Error(response);
        } else if (statusCode == HttpStatus.UNAUTHORIZED) {
            return new HTTPError.HTTP401Error(response);
        } else if (statusCode == HttpStatus.FORBIDDEN) {
            return new HTTPError.HTTP403Error(response);
        } else if (statusCode == HttpStatus.NOT_FOUND) {
            return new HTTPError.HTTP404Error(response);
        } else {
            return new HTTPError.HTTP400Error(response);
        }
    }
}
