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

export const getAlertList = async (sortby: string, dir: string, offset: number, limit: number) => {
    return new Promise((resolve, reject) => {
        //TODO - Remove after pyhton API integration
        let data = `{
            "total_records":100,
            "alerts":[
            {
            "id":0,
            "alert_uuid":0,
            "status":"Not Present",
            "type":"hw",
            "enclosure_id":0,
            "module_name":"",
            "description":"The power supply is not installed.",
            "health":"Fault",
            "health_recommendation":"- If the power supply is missing, insert a power supply of the correct type. - If the power supply is present, confirm that it is fully inserted and locked in place. - If the above steps do not resolve the issue, the power supply has probably failed and if the error persists, it should be replaced.",
            "location":"Enclosure 0 - Right",
            "resolved":0,
            "acknowledged":0,
            "severity":1,
            "state":"missing",
            "extended_info":{
            "resource_type":"fru",
            "position":"Right",
            "durable-id":"psu_0.1",
            "other_details":{
            "dc12v":0,
            "dctemp":0,
            "vendor":"",
            "description":"",
            "dc33v":0,
            "mfg-vendor-id":"",
            "fru-shortname":"",
            "serial-number":"",
            "mfg-date":"N/A",
            "part-number":"",
            "model":"",
            "revision":"",
            "dc5v":0,
            "dc12i":0,
            "dc5i":0
            }
            },
            "module_type":"psu",
            "updated_time":"2019-08-28 10:10:53.165203",
            "created_time":"2019-07-25 11:24:39.303712"
            },
            {
            "id":0,
            "alert_uuid":0,
            "status":"Not Installed",
            "type":"hw",
            "enclosure_id":0,
            "module_name":"Fan Module 4",
            "description":"The fan module is not installed.",
            "health":"Fault",
            "health_recommendation":"Install the missing fan module.",
            "location":"Enclosure 0 - Right",
            "resolved":0,
            "acknowledged":0,
            "severity":1,
            "state":"missing",
            "extended_info":{
            "resource_type":"fru",
            "fan_module":{
            "position":"Indexed",
            "durable-id":"fan_module_0.4"
            },
            "other_details":{
            "fans":[
            ]
            }
            },
            "module_type":"fan",
            "updated_time":"2019-08-28 11:14:50.059649",
            "created_time":"2019-07-25 12:42:37.204118"
            }
            ]
            }`;
        resolve(JSON.parse(data));

        //TODO: Remove comments once the Python API is up and running.
        /*let http_agent;
        if (process.env.CSM_AGENT_PROTOCOL == 'http') {
            http_agent = http;
        } else {
            http_agent = https;
        }
        let url = process.env.CSM_AGENT_PROTOCOL + "://" + process.env.CSM_AGENT_HOST
            + (process.env.CSM_AGENT_PORT ? ":" + process.env.CSM_AGENT_PORT : "")
            + "/api/v1/alerts";
        
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
        });*/
    });
};