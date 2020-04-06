/* ****************************************************************************
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
 **************************************************************************** */
import http from 'http';
import https from 'https';
import { Request, Response } from "express";
import HttpStatus from 'http-status-codes';
import * as HTTPError from '../utils/http-errors';
import logger from './../config/winston';
import FormData = require('form-data');
import fs = require('fs');
import multiparty = require('multiparty');

let base_url = process.env.CSM_AGENT_PROTOCOL + "://" + process.env.CSM_AGENT_HOST
    + (process.env.CSM_AGENT_PORT ? ":" + process.env.CSM_AGENT_PORT : "");
const file_upload_dir = process.env.FILE_UPLOAD_FOLDER;
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
    public static async getAll(url: string, req: Request, resp: Response) {
        return new Promise((resolve, reject) => {
            let geturl = base_url + url;

            // Remove following code onde all the Python APIs are ready
            // -- Start --
            if (url.startsWith("/mock")) {
                geturl = mock_base_url + url;
            }
            console.log("GET: " + geturl);
            // -- end --

            let query = req.query;
            let authorization = req.headers ? (req.headers.authorization ? req.headers.authorization : "") : "";
            for (const key in query) {
                let seperator = (geturl.indexOf('?') == -1 ? '?' : '&');
                geturl += seperator + key + "=" + query[key];
            }
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': authorization
                }
            }
            logger.info('GET: ' + geturl);
            http_agent.get(geturl, options, Api.handleResponse(resolve, reject, resp)).on("error", (err: any) => {
                let error = new HTTPError.HTTP500Error(err.message);
                reject(error);
            });
        });
    }

    // Wrapper method to for get file api, unsed in upload/download functionality
    public static async getFile(url: string, req: Request, resp: Response) {
        return new Promise((resolve, reject) => {
            let geturl = base_url + url;

            // Remove following code onde all the Python APIs are ready
            // -- Start --
            if (url.startsWith("/mock")) {
                geturl = mock_base_url + url;
            }
            console.log("GET: " + geturl);
            // -- end --

            let query = req.query;
            let authorization = req.headers ? (req.headers.authorization ? req.headers.authorization : "") : "";
            for (const key in query) {
                let seperator = (geturl.indexOf('?') == -1 ? '?' : '&');
                geturl += seperator + key + "=" + query[key];
            }
            const options = {
                headers: {
                    'authorization': authorization,
                    'responseType': 'blob'
                }
            }

            logger.info('GET: ' + geturl);
            http_agent.get(geturl, options, Api.handleFileResponse(resolve, reject, resp)).on("error", (err: any) => {
                let error = err.message;
                reject(error);
            });
        });
    }

    // Wrapper method to for get api
    public static async get(url: string, req: Request, resp: Response, id: string | number) {
        return new Promise((resolve, reject) => {
            let geturl = base_url + url;

            // Remove following code onde all the Python APIs are ready
            // -- Start --
            if (url.startsWith("/mock")) {
                geturl = mock_base_url + url;
            }

            if (id && id != "") {
                geturl += "/" + id;
            }
            console.log("GET: " + geturl);
            // -- end --

            let query = req.query;
            let authorization = req.headers ? (req.headers.authorization ? req.headers.authorization : "") : "";
            for (const key in query) {
                let seperator = (geturl.indexOf('?') == -1 ? '?' : '&');
                geturl += seperator + key + "=" + query[key];
            }
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': authorization
                }
            }

            logger.info('GET: ' + geturl);
            http_agent.get(geturl, options, Api.handleResponse(resolve, reject, resp)).on("error", (err: any) => {
                let error = new HTTPError.HTTP500Error(err.message);
                reject(error);
            });
        });
    }

    public static async patch(url: string, req: Request, resp: Response, id: string | number) {
        return new Promise((resolve, reject) => {
            const requestData = JSON.stringify(req.body);
            let patchurl = base_url + url;
            // Remove following code onde all the Python APIs are ready
            // -- Start --
            if (url.startsWith("/mock")) {
                patchurl = mock_base_url + url;
            }

            if (id && id != "") {
                patchurl += "/" + id;
            }
            console.log("PATCH: " + patchurl);
            // -- end --
            let authorization = req.headers ? (req.headers.authorization ? req.headers.authorization : "") : "";
            const options = {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': requestData.length,
                    'authorization': authorization
                }
            }

            logger.info('PATCH: ' + patchurl);
            let httpRequest = http_agent.request(patchurl, options, Api.handleResponse(resolve, reject, resp)).on("error", (err: any) => {
                let error = new HTTPError.HTTP500Error(err.message);
                reject(error);
            });
            httpRequest.write(requestData);
            httpRequest.end();
        });
    }

    public static async put(url: string, req: Request, resp: Response, id: string | number) {
        return new Promise((resolve, reject) => {
            const requestData = JSON.stringify(req.body);
            let puturl = base_url + url;
            // Remove following code onde all the Python APIs are ready
            // -- Start --
            if (url.startsWith("/mock")) {
                puturl = mock_base_url + url;
            }

            if (id && id != "") {
                puturl += "/" + id;
            }
            console.log("put: " + puturl);
            // -- end --
            let authorization = req.headers ? (req.headers.authorization ? req.headers.authorization : "") : "";
            const options = {
                method: "put",
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': requestData.length,
                    'authorization': authorization
                }
            }

            logger.info('PUT: ' + puturl);
            let httpRequest = http_agent.request(puturl, options, Api.handleResponse(resolve, reject, resp)).on("error", (err: any) => {
                let error = new HTTPError.HTTP500Error(err.message);
                reject(error);
            });
            httpRequest.write(requestData);
            httpRequest.end();
        });
    }

    public static async post(url: string, req: Request, resp: Response, id?: string | number) {
        return new Promise((resolve, reject) => {
            const requestData = JSON.stringify(req.body);
            let posturl = base_url + url + ((id) ? "/" + id : "");
            // Remove following code onde all the Python APIs are ready
            // -- Start --
            if (url.startsWith("/mock")) {
                posturl = mock_base_url + url + ((id) ? "/" + id : "");
            }
            console.log("POST: " + posturl);
            // -- end --
            let authorization = req.headers ? (req.headers.authorization ? req.headers.authorization : "") : "";
            const options = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': requestData.length,
                    'authorization': authorization
                }
            }

            logger.info('POST: ' + posturl);
            let httpRequest = http_agent.request(posturl, options, Api.handleResponse(resolve, reject, resp)).on("error", (err: any) => {
                console.log("1. " + err);
                let error = new HTTPError.HTTP500Error(err.message);
                reject(error);
            });
            httpRequest.write(requestData);
            httpRequest.end();
        });
    }

    public static async uploadFiles(url: string, req: Request, resp: Response, id?: string | number) {
        return new Promise((resolve, reject) => {
            const requestData = JSON.stringify(req.body);
            let posturl = base_url + url + ((id) ? "/" + id : "");
            // Remove following code onde all the Python APIs are ready
            // -- Start --
            if (url.startsWith("/mock")) {
                posturl = mock_base_url + url + ((id) ? "/" + id : "");
            }
            console.log("POST: " + posturl);
            // -- end --

            // -- Multiparty
            let form = new multiparty.Form({ uploadDir: file_upload_dir });
            form.parse(req, (err, fields, files) => {});

            form.on('file', function (name, file) {
                const form = new FormData();
                form.append(name, fs.createReadStream(file.path), {filename: file.originalFilename});

                const headers = form.getHeaders();
                headers['authorization'] = req.headers ? (req.headers.authorization ? req.headers.authorization : "") : "";

                const options = {
                    method: 'POST',
                    headers: headers,
                };

                const httpRequest = http_agent.request(posturl, options, Api.handleResponse(resolve, reject, resp)).on("error", (err: any) => {
                    let error = new HTTPError.HTTP500Error(err.message);
                    reject(error);
                });

                httpRequest.on("close", ()=> {
                    fs.unlink(file.path, (err) => {});
                });

                form.pipe(httpRequest);
            });
        });
    }
    
    public static async delete(url: string, req: Request, resp: Response, id?: string | number) {
        return new Promise((resolve, reject) => {
            let deleteUrl = base_url + url + ((id) ? "/" + id : "");
            // Remove following code onde all the Python APIs are ready
            // -- Start --
            if (url.startsWith("/mock")) {
                deleteUrl = mock_base_url + url + ((id) ? "/" + id : "");
            }
            console.log("DELETE: " + deleteUrl);
            // -- end --
            const requestData = req && req.body ? JSON.stringify(req.body) : "";
            let authorization = req.headers ? (req.headers.authorization ? req.headers.authorization : "") : "";
            const options = {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': requestData.length,
                    'authorization': authorization
                }
            }

            logger.info('DELETE: ' + deleteUrl);
            let httpRequest = http_agent.request(deleteUrl, options, Api.handleResponse(resolve, reject, resp)).on("error", (err: any) => {
                let error = new HTTPError.HTTP500Error(err.message);
                reject(error);
            });
            httpRequest.write(requestData);
            httpRequest.end();
        });
    }

    private static handleResponse(resolve: (value?: unknown) => void, reject: (value?: unknown) => void, resp: Response): any {
        return (apiresp: any) => {
            let data = '';
            let response: any;

            if (apiresp.headers.authorization) {
                resp.set("Authorization", apiresp.headers.authorization);
            }
            
            resp.status(apiresp.statusCode);

            apiresp.on('data', (chunk: any) => {
                data += chunk;
            });
            apiresp.on('end', () => {
                try {
                    response = JSON.parse(data);
                } catch (err) {
                    response = data;
                }
                if (sucessCodeRegex.test(apiresp.statusCode)) {
                    logger.info('SUCCESS RESPONSE: ' + JSON.stringify(response));
                    resolve(response);
                } else {
                    let err = Api.handleError(apiresp.statusCode, response);
                    logger.error('ERROR RESPONSE: ' + JSON.stringify(response) + ' STATUS CODE: ' 
                    + apiresp.statusCode + ' ERROR: ' + JSON.stringify(err));
                    reject(err);
                }
            });
        };
    }

    private static handleFileResponse(resolve: (value?: unknown) => void, reject: (value?: unknown) => void, resp: Response): any {
        return (req: any) => {
            let data: any = [];
            let response: any;

            if (req.headers.authorization) {
                resp.set("Authorization", req.headers.authorization);
            }
            // Set all request headers to response object
            if (req.headers["accept-ranges"]) resp.set("accept-ranges", req.headers["accept-ranges"]);
            if (req.headers["cache-control"]) resp.set("cache-control", req.headers["cache-control"]);
            if (req.headers["content-disposition"]) resp.set("content-disposition", req.headers["content-disposition"]);
            if (req.headers["content-encoding"]) resp.set("content-encoding", req.headers["content-encoding"]);// "x-tar"
            if (req.headers["content-length"]) resp.set("content-length", req.headers["content-length"]);
            if (req.headers["content-security-policy"]) resp.set("content-security-policy", req.headers["content-security-policy"]);
            if (req.headers["content-type"]) resp.set("content-type", req.headers["content-type"]);
            if (req.headers["date"]) resp.set("date", req.headers["date"]);
            if (req.headers["expires"]) resp.set("expires", req.headers["expires"]);
            if (req.headers["last-modified"]) resp.set("last-modified", req.headers["last-modified"]);
            if (req.headers["pragma"]) resp.set("pragma", req.headers["pragma"]);
            if (req.headers["referrer-policy"]) resp.set("referrer-policy", req.headers["referrer-policy"]);
            if (req.headers["server"]) resp.set("server", req.headers["server"]);
            if (req.headers["strict-transport-security"]) resp.set("strict-transport-security", req.headers["strict-transport-security"]);
            if (req.headers["x-content-type-options"]) resp.set("x-content-type-options", req.headers["x-content-type-options"]);
            if (req.headers["x-frame-options"]) resp.set("x-frame-options", req.headers["x-frame-options"]);
            if (req.headers["x-xss-protection"]) resp.set("x-xss-protection", req.headers["x-xss-protection"]);

            req.on('data', (chunk: any) => {
                // Push chunk-data coming from server to response data object
                data.push(chunk);
            });
            req.on('end', () => {
                try {
                    // Prepare response data as a Buffer obj so that it will get treatement as a file
                    response = Buffer.concat(data);
                } catch (err) {
                    response = data;
                }
                if (sucessCodeRegex.test(req.statusCode)) {
                    logger.info('SUCCESS RESPONSE');
                    resolve(response);
                } else {
                    let err = Api.handleError(req.statusCode, response);
                    logger.error('ERROR RESPONSE: STATUS CODE: ' 
                    + req.statusCode + ' ERROR: ' + JSON.stringify(err));
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
        } else if (statusCode == 499) {
            return new HTTPError.HTTP499Error(response);
        } else if (statusCode == HttpStatus.NOT_IMPLEMENTED) {
            return new HTTPError.HTTP501Error(response);
        } else if (statusCode == HttpStatus.CONFLICT) {
            return new HTTPError.HTTP409Error(response);
        } else if (statusCode == HttpStatus.UNPROCESSABLE_ENTITY) {
            return new HTTPError.HTTP422Error(response);
        } else {
            return new HTTPError.HTTP400Error(response);
        }
    }
}
