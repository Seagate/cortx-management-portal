/*****************************************************************************
 Filename:          AlertsProvider.ts
 Description:       Sends requests to Python server and returns the response 
                    received from Python server.

 Creation Date:     21/08/2019
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

let base_url = process.env.CSM_AGENT_PROTOCOL + "://" + process.env.CSM_AGENT_HOST
    + (process.env.CSM_AGENT_PORT ? ":" + process.env.CSM_AGENT_PORT : "");
let http_agent: any;
if (process.env.CSM_AGENT_PROTOCOL == 'http') {
    http_agent = http;
} else {
    http_agent = https;
}

/**
 * The get API to get the alerts.
 * @param sortby 
 * @param dir 
 * @param offset 
 * @param limit 
 */
export const getAlertList = async (sortby: string, dir: string, offset: number, limit: number) => {
    return new Promise((resolve, reject) => {
        let http_agent;
        if (process.env.CSM_AGENT_PROTOCOL == 'http') {
            http_agent = http;
        } else {
            http_agent = https;
        }
        let url = base_url + "/api/v1/alerts";
        
        if(sortby){
            let seperator = (url.indexOf('?') == -1 ? '?' : '&');
            url += seperator + "sortby=" + sortby;
        }
        if(dir){
            let seperator = (url.indexOf('?') == -1 ? '?' : '&');
            url += seperator + "dir=" + dir;
        }
        if(offset){
            let seperator = (url.indexOf('?') == -1 ? '?' : '&');
            url += seperator + "offset=" + offset;
        }
        if(limit){
            let seperator = (url.indexOf('?') == -1 ? '?' : '&');
            url += seperator + "limit=" + limit;
        }
        
        http_agent.get(url, (resp) => {
            let data = '';

            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                resolve(JSON.parse(data));
            });

        }).on("error", (err) => {
            reject(err);
            console.log("Error: " + err.message);
        });
    });
};

/**
 * The API is to update the specified alert.
 * @param req 
 */
export const updateAlert = async (req: Request) => {
    return new Promise((resolve, reject) => {
        const requestData = JSON.stringify(req.body);
        const url = base_url + "/api/v1/alerts/" + req.params.alert_id;
        resolve();
        // const options = {
        //     method: "PATCH",
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Content-Length': requestData.length
        //     }
        // }

        // let httpRequest = http_agent.request(url, options, (resp: any) => {
        //     let data = '';
        //     resp.on('data', (chunk: any) => {
        //         data += chunk;
        //     })
        //     resp.on('end', () => {
        //         console.log(data);
        //         resolve(JSON.parse(data));
        //     });
        // }).on("error", (err: any) => {
        //     reject(err);
        //     console.log("Error: " + err.message);
        // });
        // httpRequest.write(requestData);
        // httpRequest.end();
    });
};
