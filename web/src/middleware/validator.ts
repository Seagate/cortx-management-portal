/*****************************************************************************
 Filename:          checks.ts
 Description:       validates the request parameters based on the criteria
                    mentioned in apigetparameters.json.

 Creation Date:     23/08/2019
 Author:            Soniya Moholkar

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
import { Request, Response, NextFunction } from "express";
import { HTTP400Error } from "../utils/http-errors";
import * as getparams from './../api-mandatory-params.json';
import * as sortValidators from './sort-validator';

/**
 * This method validates the request parameters based on their mandatory criteria
 * on this API level. This API and its mandatory parameters are defined in the 
 * apiparameters.json. 
 * @param req 
 * @param res 
 * @param next 
 */
export const checkRequiredParams = (req: Request, res: Response, next: NextFunction) => {
  let u = new URL("http://" + req.url);
  let params = u.searchParams;
  let path = req.url.includes("?") ? req.url.substring(0, req.url.indexOf("?")) : req.url;
  let objectValue = JSON.parse(JSON.stringify(getparams));
  let requiredParams = objectValue[path];
  let validparam = true;
  let validparamtype = false
  let validvalidatorparam = true;
  if (requiredParams) {
    let count = Object.keys(requiredParams).length;
    for (let i = 0; i < count; i++) {
      let requiredParam = requiredParams[i];
      if (requiredParam.required && !requiredParam.default && !params.has(requiredParam.paramname.trim())) {
        validparam = false;
        break;
      }
      //Add default params to url which may be used at the time of caching
      if (!params.has(requiredParam.paramname.trim()) && requiredParam.default) {
        if (req.url) {
          let urle = req.url;
          let url = decodeURIComponent(urle);
          let firstSeperator = (url.indexOf('?') == -1 ? '?' : '&');
          let queryStringParts = new Array();
          queryStringParts.push(requiredParam.paramname.trim() + '=' + encodeURIComponent(requiredParam.default));
          let queryString = queryStringParts.join('&');
          req.url = url + firstSeperator + queryString;
        }
      }
      if (params.has(requiredParam.paramname.trim())) {
        let requestValue = Number(req.query[requiredParam.paramname.trim()]);
        if (isNaN(requestValue)) {
          requestValue = req.query[requiredParam.paramname.trim()];
        }
        let datatype = requiredParam.datatype;
        if (!datatype || datatype == "string") {
          datatype = "string|number";
        }
        let datatypes = datatype.split("|");
        let datatypecount = Object.keys(datatypes).length;
        validparamtype = false;
        for (let j = 0; j < datatypecount; j++) {
          if (datatypes[j] == typeof requestValue) {
            validparamtype = true;
            break;
          }
        }

        if (!validparamtype) {
          break;
        } else {
          if (requiredParam.validators) {
            let validators = requiredParam.validators.split(",");
            let validatorscount = Object.keys(validators).length;
            for (let j = 0; j < validatorscount; j++) {
              let func = validators[j];
              let arr = new Map(Object.entries(sortValidators));
              let fun = arr.get(func);
              if (fun) {
                validvalidatorparam = fun.call(fun, req, res, next);
              }
              if (!validvalidatorparam) {
                break;
              }
            }
            if (!validvalidatorparam) {
              break;
            }
          }
        }
      } else {
        validparamtype = true;
      }
    }
    if (validparam && validparamtype && validvalidatorparam) {
      next();
    } else if (!validparam) {
      throw new HTTP400Error("Missing required parameters");
    } else if (!validparamtype || !validvalidatorparam) {
      throw new HTTP400Error("Missing valid required parameters");
    } else {
      throw new HTTP400Error("Some error occurred.");
    }
  } else {
    next();
  }
};