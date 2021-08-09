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
import http from 'http';
import https from 'https';
import { Request, Response } from "express";
import HttpStatus from 'http-status-codes';
import * as HTTPError from '../utils/http-errors';
import logger from './../config/winston';
import FormData = require('form-data');
import querystring = require('querystring');
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

            let urle = decodeURI(req.originalUrl);
            var query_index = urle.indexOf('?');
            var query_string = (query_index>=0)?urle.slice(query_index+1):'';
            geturl += "?" + query_string;
            logger.info('headers:--------> ' + JSON.stringify(req.headers))
            var headers = Api.setHeaders(req);

            const options = {
                headers: headers
            }
            logger.info('options headers:--------> ' + JSON.stringify(options.headers))
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
            let urle = decodeURI(req.originalUrl);
            var query_index = urle.indexOf('?');
            var query_string = (query_index>=0)?urle.slice(query_index+1):'';
            geturl += "?" + query_string;
            logger.info('headers:--------> ' + JSON.stringify(req.headers))
            var headers = Api.setHeaders(req);
            const options = {
                headers: headers
            }
            logger.info('options headers:--------> ' + JSON.stringify(options.headers))
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
            let urle = decodeURI(req.originalUrl);
            var query_index = urle.indexOf('?');
            var query_string = (query_index>=0)?urle.slice(query_index+1):'';
            geturl += "?" + query_string;
            logger.info('headers:--------> ' + JSON.stringify(req.headers))
            var headers = Api.setHeaders(req);
            const options = {
                headers: headers
            }
            logger.info('options headers:--------> ' + JSON.stringify(options.headers))
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
            
            logger.info('headers:--------> ' + JSON.stringify(req.headers))
            var headers = Api.setHeaders(req);

            const options = {
                method: "PATCH",
                headers: headers
            }
            logger.info('options headers:--------> ' + JSON.stringify(options.headers))
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
            logger.info('headers:--------> ' + JSON.stringify(req.headers))
            var headers = Api.setHeaders(req);

            const options = {
                method: "put",
                headers: headers
            }
            logger.info('options headers:--------> ' + JSON.stringify(options.headers))
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
            logger.info('headers:--------> ' + JSON.stringify(req.headers))
            var headers = Api.setHeaders(req);

            const options = {
                method: "POST",
                headers: headers
            }
            logger.info('options headers:--------> ' + JSON.stringify(options.headers))
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
            const dir = file_upload_dir?file_upload_dir:"";
            try {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                    logger.info(dir + " is created.");
                } else {
                    logger.info(dir + " is present");
                }            
            }catch(e){
                logger.error("Error during creating " + dir + " error:" + e);
            }
            
            const requestData = JSON.stringify(req.body);
            let posturl = base_url + url + ((id) ? "/" + id : "");
            // Remove following code onde all the Python APIs are ready
            // -- Start --
            if (url.startsWith("/mock")) {
                posturl = mock_base_url + url + ((id) ? "/" + id : "");
            }
            logger.info("POST: " + posturl);
            // -- end --
            // -- Multiparty
            
            let form = new multiparty.Form({ uploadDir: file_upload_dir });
            form.parse(req, (err, fields, files) => {});
            form.on('file', function (name, file) {
                const form = new FormData();
                form.append(name, fs.createReadStream(file.path), {filename: file.originalFilename});
                const headers = form.getHeaders();
                const client_ip = Api.getClientIP(req);
                headers['authorization'] = req.headers.authorization ? req.headers.authorization : "";
                headers['x-forwarded-host'] =  req.headers['host'] ? req.headers['host'] : "";
                headers['x-forwarded-proto'] =  req.headers['x-forwarded-proto'] ? req.headers['x-forwarded-proto'] : "";
                headers['x-forwarded-for'] = client_ip;
                const options = {
                    method: 'POST',
                    headers: headers,
                };
                logger.info('options headers:--------> ' + JSON.stringify(headers));
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
            logger.info('headers:--------> ' + JSON.stringify(req.headers))
            var headers = Api.setHeaders(req);

            const requestData = req && req.body ? JSON.stringify(req.body) : "";
            const options = {
                method: "DELETE",
                headers: headers
            }
            logger.info('options headers:--------> ' + JSON.stringify(options.headers))
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
                    logger.info('SUCCESS RESPONSE');
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
    private static getClientIP(req: Request) {
        var client_ip = (typeof req.headers['x-forwarded-for'] === 'string'
                && req.headers['x-forwarded-for'].split(',').shift())
                || req.connection?.remoteAddress;
        if(client_ip) {
            client_ip = client_ip.replace("::ffff:", "")
        }
        return client_ip;
    }
    private static setHeaders(req: Request) {
        const requestData = req.body ? JSON.stringify(req.body) : "";
        const client_ip = Api.getClientIP(req);
        let contentLength = 0;
        try {
            if(Object.keys(JSON.parse(requestData)).length > 0)
                contentLength = requestData.length
        } catch(e){
            logger.error("Error during parsing request body " + requestData + " error:" + e);
        }
        
        var headers = {
            'Content-Type': 'application/json',
            'Content-Length': contentLength,
            'authorization': req.headers.authorization ? req.headers.authorization : "",
            'user-agent': req.headers['user-agent'] ? req.headers['user-agent'] : "",
            'x-forwarded-host':  req.headers['host'] ? req.headers['host'] : "",
            'x-forwarded-proto': req.headers['x-forwarded-proto'] ? req.headers['x-forwarded-proto'] : "",
            'x-forwarded-for': client_ip            
        };
        return headers;        
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
                    const errResponseString = response.toString("utf-8");
                    const errResponseJSONObj = JSON.parse(errResponseString);
                    let err = Api.handleError(req.statusCode, errResponseJSONObj);
                    logger.error('ERROR RESPONSE: STATUS CODE: ' 
                    + req.statusCode + ' ERROR: ' + errResponseString);
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
        } else if (statusCode == HttpStatus.INTERNAL_SERVER_ERROR) {
            return new HTTPError.HTTP500Error(response);
        } else if (statusCode == HttpStatus.NOT_IMPLEMENTED) {
            return new HTTPError.HTTP501Error(response);
        } else if (statusCode == HttpStatus.CONFLICT) {
            return new HTTPError.HTTP409Error(response);
        } else if (statusCode == HttpStatus.UNPROCESSABLE_ENTITY) {
            return new HTTPError.HTTP422Error(response);
        } else if (statusCode == HttpStatus.SERVICE_UNAVAILABLE) {
            return new HTTPError.HTTP503Error(response);
        } else {
            return new HTTPError.HTTP400Error(response);
        }
    }
}
